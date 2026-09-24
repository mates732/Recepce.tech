import Stripe from 'stripe';
import { env } from '@/lib/env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-08-26.dahlia',
  typescript: true,
});

export async function createStripeCustomer(
  email: string,
  name: string,
  metadata: Record<string, string>
): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email,
    name,
    metadata,
  });
}

export async function getStripeCustomer(customerId: string): Promise<Stripe.Customer | null> {
  try {
    return await stripe.customers.retrieve(customerId) as Stripe.Customer;
  } catch {
    return null;
  }
}

export async function createStripeSubscription(
  customerId: string,
  priceId: string,
  metadata: Record<string, string>
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata,
    payment_behavior: 'default_incomplete',
    payment_settings: {
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  });
}

export async function getStripeSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch {
    return null;
  }
}

export async function cancelStripeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId);
}

export async function createStripePrice(
  amount: number,
  currency: string,
  interval: 'month' = 'month',
  productName: string,
  metadata: Record<string, string>
): Promise<Stripe.Price> {
  const product = await stripe.products.create({
    name: productName,
    metadata,
  });

  return stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency,
    recurring: { interval },
    metadata,
  });
}

export async function createStripeInvoiceItem(
  customerId: string,
  amount: number,
  currency: string,
  description: string,
  metadata: Record<string, string>
): Promise<Stripe.InvoiceItem> {
  return stripe.invoiceItems.create({
    customer: customerId,
    amount,
    currency,
    description,
    metadata,
  });
}

export async function createStripeInvoice(
  customerId: string,
  metadata: Record<string, string>
): Promise<Stripe.Invoice> {
  return stripe.invoices.create({
    customer: customerId,
    auto_advance: true,
    collection_method: 'charge_automatically',
    metadata,
  });
}

export async function finalizeStripeInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return stripe.invoices.finalizeInvoice(invoiceId);
}

export function verifyStripeWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

export function formatStripeAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100);
}