# Recepce.tech Admin — Documentation

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ /admin   │  │/admin/   │  │/admin/   │  │ /login       │   │
│  │          │  │clients   │  │clients/[ │  │              │   │
│  │Dashboard │  │          │  │ id]      │  │ Admin Auth   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │              │              │                │           │
└───────┼──────────────┼──────────────┼────────────────┼───────────┘
        │              │              │                │
        ▼              ▼              ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Middleware                           │
│              (JWT session verification)                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Routes                                  │
│  /api/admin/clients          GET (list) / POST (create)         │
│  /api/admin/clients/[id]     GET (detail)                       │
│  /api/admin/clients/[id]/    POST (sync Vapi calls)             │
│       sync-vapi                                                            │
│  /api/admin/reconcile        POST (daily/manual/period-end)     │
│  /api/admin/login            POST (auth)                        │
│  /api/admin/logout           POST (logout)                      │
│  /api/webhooks/vapi          POST (Vapi end-of-call)            │
│  /api/webhooks/stripe        POST (Stripe events)               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Prisma ORM                                  │
│  Client, ClientBilling, VapiAssistant, Call, UsagePeriod,       │
│  WebhookEvent, BillingEvent, AuditLog                           │
└──────────┬──────────────────────────┬───────────────────────────┘
           │                          │
           ▼                          ▼
┌──────────────────┐      ┌──────────────────────┐
│   PostgreSQL DB  │      │  External Services   │
│                  │      │                      │
│  - Clients data  │      │  Vapi API            │
│  - Billing data  │      │  - Get assistant     │
│  - Call records  │      │  - Get calls         │
│  - Usage data    │      │  - Webhook receives  │
│  - Audit logs    │      │  Stripe API          │
└──────────────────┘      │  - Customers         │
                          │  - Subscriptions     │
                          │  - Invoices          │
                          └──────────────────────┘
```

## Client Setup

### Create a new client (admin UI)

1. Navigate to `/admin/clients/new`
2. Fill in the form:
   - Name (e.g., "Textil Ludmila")
   - Slug (e.g., "textil-ludmila")
   - Contact name and email
   - Monthly price in CZK
   - Included minutes
   - Overage price per minute
   - Vapi Assistant ID
   - Vapi Phone Number ID (optional)
3. Click "Vytvořit klienta"
4. System creates:
   - Client record in DB
   - Stripe customer (if Stripe configured)
   - Stripe subscription (if price ID configured)
   - Vapi assistant link
   - Audit log entry

### Textil Ludmila setup

Textil Ludmila is NOT hardcoded. To create:

1. Go to `/admin/clients/new`
2. Enter:
   - Name: `Textil Ludmila`
   - Slug: `textil-ludmila`
   - Monthly price: `2990`
   - Included minutes: `300`
   - Overage price: `6`
   - Vapi Assistant ID: (from environment `VAPI_ASSISTANT_ID_LUDMILA`)
3. Submit the form

Or via seed script:
```bash
npx tsx scripts/seed-ludmila.ts
```

### UGO Salaterie (Stromovka)

Same flow, or via seed script:
```bash
npx tsx scripts/seed-ugo.ts
```

Requires `VAPI_ASSISTANT_ID_UGO_STROMOVKA` in `.env.local` — the script
stores it on the `VapiAssistant` record. The public demo at `/demo`
additionally needs `VAPI_ASSISTANT_ID_UGO_STROMOVKA` + a public key
(`PUBLIC_VAPI_PUBLIC_KEY` or per-assistant `PUBLIC_VAPI_PUBLIC_KEY_UGO_STROMOVKA`)
at request time; without them `/api/vapi/session` returns 503 and the demo
button shows a configuration message.

## Vapi Configuration

### Webhook Setup

1. In Vapi dashboard, configure webhook URL:
   ```
   https://your-domain.com/api/webhooks/vapi
   ```
2. Set the webhook secret in Vapi dashboard
3. Add `VAPI_SERVER_SECRET` to `.env` — used to verify webhook signatures

### How it works

1. Vapi sends `end-of-call-report` to `/api/webhooks/vapi`
2. Server verifies HMAC-SHA256 signature using `VAPI_SERVER_SECRET`
3. Server checks idempotency (external event ID)
4. Call is stored with:
   - Billable minutes: `ceil(duration_seconds / 60)`
   - Vapi cost (if reported)
5. Usage period is updated
6. Alerts are checked at 80/90/100/110% thresholds
7. Audit log entry is created

### Billing Rule

```
billable_minutes = ceil(duration_seconds / 60)
```

Examples:
- 1 second → 1 minute
- 61 seconds → 2 minutes
- 121 seconds → 3 minutes

If Vapi reports `billableDuration` or `cost`, those are used preferentially.

## Stripe Configuration

### Setup

1. Create Stripe account (or use existing)
2. Create a product "Recepce.tech Subscription"
3. Create a recurring price (e.g., 2990 CZK/month)
4. Create an overage price (e.g., 6 CZK/minute)
5. Set environment variables:
   ```
   STRIPE_SECRET_KEY=sk_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   STRIPE_PRICE_ID=price_xxx
   STRIPE_OVERAGE_PRICE_ID=price_xxx
   ```
6. Configure webhook endpoint in Stripe dashboard:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```

### Webhook Events Handled

- `customer.subscription.created` — sync subscription state
- `customer.subscription.updated` — sync subscription state
- `customer.subscription.deleted` — mark client as cancelled
- `invoice.payment_succeeded` — mark billing event as billed
- `invoice.payment_failed` — pause client
- `invoice.finalized` — invoice created

## Overdue Billing

### How overage works

1. During billing period, usage is tracked per call
2. At period end (or manual trigger), reconciliation runs:
   - Fetches all calls from Vapi
   - Recalculates usage from stored calls
   - Compares DB state with actual calls
   - If overage > 0 and not yet billed:
     - Creates Stripe subscription item with overage price
     - Creates billing event (idempotent per client+period+type)
3. Overage billing is idempotent — running twice creates no duplicate charges

### Idempotency

Every billing operation stores a unique key:
- Webhook events: `(provider, externalEventId)`
- Billing events: `(clientId, periodId, type, stripeEventId)`

Duplicate detection prevents:
- Duplicate calls from Vapi webhooks
- Duplicate billing from Stripe webhooks
- Duplicate overage charges from reconciliation

## Usage Calculation

```
included_minutes = client.billing.includedMinutes (configurable per client)
used_minutes = sum(billable_minutes) for calls in current billing period
overage_minutes = max(0, used_minutes - included_minutes)
overage_amount = overage_minutes * client.billing.overagePricePerMinute
estimated_total = client.billing.monthlyPrice + overage_amount
```

Billing period comes from Stripe subscription dates when available, otherwise calendar month.

## Environment Variables

See `.env.example` for complete list. Required variables:

| Variable | Description |
|----------|-------------|
| `VAPI_API_KEY` | Vapi private API key |
| `VAPI_SERVER_SECRET` | Vapi webhook signing secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_ID` | Stripe recurring subscription price ID |
| `STRIPE_OVERAGE_PRICE_ID` | Stripe overage price ID |
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_SESSION_SECRET` | JWT signing secret for admin sessions |
| `NEXT_PUBLIC_APP_URL` | Public application URL |

## Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in all required variables
3. Set up PostgreSQL database
4. Run Prisma migration:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed Textil Ludmila (optional):
   ```bash
   npx tsx scripts/seed-ludmila.ts
   ```
6. Start development server:
   ```bash
   npm run dev
   ```
7. Navigate to `http://localhost:3000/login`

## Production Deployment

### Vercel

1. Set all environment variables in Vercel dashboard
2. Deploy as normal Next.js app
3. Configure Vapi webhook URL: `https://your-app.vercel.app/api/webhooks/vapi`
4. Configure Stripe webhook URL: `https://your-app.vercel.app/api/webhooks/stripe`

### Self-hosted

1. Run PostgreSQL (Docker recommended):
   ```bash
   docker run -d --name recepce-db \
     -e POSTGRES_PASSWORD=secret \
     -e POSTGRES_DB=recepce \
     -p 5432:5432 postgres:16
   ```
2. Set `DATABASE_URL=postgresql://postgres:secret@localhost:5432/recepce`
3. Run migration
4. Start app: `npm run start`

## How Billing Works

1. **Client creation**: Admin creates client with monthly plan config
2. **Stripe subscription**: Recurring charge at monthly price
3. **Call processing**: Each Vapi call → billable minutes stored
4. **Usage tracking**: Sum of billable minutes per billing period
5. **Overage calculation**: `max(0, used - included) × overage_price`
6. **Estimated total**: `monthly_price + overage_amount`
7. **Period-end billing**: Reconciliation creates overage charge in Stripe
8. **Alerts**: Admin notified at 80/90/100/110% usage thresholds

## Tests

Run tests:
```bash
npx jest __tests__/
```

Test coverage:
- Minute calculation (0s, 1s, 60s, 61s, 121s)
- Usage calculation (under limit, at limit, over limit)
- Overage calculation (0, 1, 27 minutes over)
- Webhook idempotency (duplicate Vapi/Stripe events)
- Overage billing idempotency

## Remaining Production Steps

1. Set up PostgreSQL database (production)
2. Configure Vapi webhook endpoint with signing secret
3. Configure Stripe webhook endpoint with signing secret
4. Set up monitoring/alerting for webhook failures
5. Configure backup strategy for database
6. Set up CI/CD pipeline
7. Load test webhook endpoints
8. Verify all admin routes are protected
9. Verify no secrets in client-side bundles
10. Set up error tracking (Sentry, etc.)