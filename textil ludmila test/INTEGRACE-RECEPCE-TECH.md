# Napojení dema na recepce.tech

Demo běží na Vercelu a je připravené k okamžitému napojení:

**URL dema:** https://textil-ludmila-vapi.vercel.app/demo

---

## 1) Odkaz z recepce.tech (nejjednodušší)

Kamkoliv na recepce.tech vložte:

```html
<a href="https://textil-ludmila-vapi.vercel.app/demo"
   target="_blank" rel="noopener">
   Zobrazit demo pro Textil Ludmila →
</a>
```

## 2) Vložení přímo do stránky recepce.tech (iframe)

Demo lze zobrazit přímo v obsahu recepce.tech:

```html
<iframe
  src="https://textil-ludmila-vapi.vercel.app/demo"
  title="Demo webu pro Textil Ludmila"
  style="width:100%;height:min(860px,90vh);border:1px solid #e8ddcd;border-radius:18px"
  loading="lazy"
  allow="microphone; autoplay"></iframe>
```

**Důležité:** atribut `allow="microphone; autoplay"` je nutný, jinak
prohlížeč v iframu nepustí hlasového recepčního.

## 3) Vlastní subdoména (varianta pro „oficiální" napojení)

Chcete-li demo pod doménou recepce.tech (např. `textil-ludmila.recepce.tech`):

1. V projektu na Vercelu: **Settings → Domains → Add** → `textil-ludmila.recepce.tech`
2. U svého DNS poskytovatele přidejte CNAME záznam:
   `textil-ludmila → cname.vercel-dns.com`
3. Do proměnných projektu (Settings → Environment Variables) přidejte:

   ```
   ALLOWED_ORIGIN = https://textil-ludmila.recepce.tech
   ```

   Tím povolíte Vapi secure mode i pro tuto doménu
   (`*.vercel.app` a `localhost` jsou povolené automaticky).
4. Redeploy (po změně env proměnných se má projít nový build).

Poté stačí z recepce.tech odkazovat na `https://textil-ludmila.recepce.tech`.

## 4) Denní souhrn pro Telegram bota

Endpoint s agregovanými daty (návštěvy, unikátní session, průměrný čas,
použití asistenta, 👍/😒/👎):

```
GET https://textil-ludmila-vapi.vercel.app/track?days=1
```

Ukázková odpověď:

```json
{
  "visits": 12,
  "uniqueSessions": 9,
  "avgDurationSeconds": 84,
  "sectionViews": { "recepce": 8, "kontakt": 5 },
  "assistant": { "opens": 6, "interactions": 14 },
  "feedback": { "up": 5, "neutral": 1, "down": 0, "total": 6 }
}
```

**Omezení, které je dobré vědět:** serverless funkce na Vercelu ukládají
eventy do `/tmp`, což je efemérní úložiště. Pro spolehlivý dlouhodobý
souhrn doporučujeme připojit Vercel Blob nebo Vercel KV a ukládání v
`api/track.js` přepnout na něj – struktura eventů zůstane stejná,Telegram
integrace se nemusí měnit vůbec.

---

## Co kde je

| Soubor | Účel |
|---|---|
| `demo.html` | Samotná demo stránka |
| `assets/demo.css`, `assets/demo.js` | Styly, tracking, recepční widget |
| `api/config.js`, `api/vapi-token.js` | Vapi credentials (secure mode) |
| `api/track.js` | Sběr a agregace tracking eventů |
| `index.html` | Původní testovací stránka asistenta (nezměněna) |
