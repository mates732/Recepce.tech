import { writeFileSync } from 'node:fs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PAGE = 'http://localhost:3000/demo';

let ws;
for (let i = 0; i < 60 && !ws; i++) {
  try {
    const list = await (await fetch('http://127.0.0.1:9222/json/list')).json();
    const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch {
    /* chrome ještě neběží */
  }
  if (!ws) await sleep(250);
}
if (!ws) throw new Error('CDP target nenalezen');
await new Promise((res, rej) => {
  ws.addEventListener('open', res);
  ws.addEventListener('error', rej);
});

let id = 0;
const pending = new Map();
const consoleErrors = [];
const exceptions = [];
ws.addEventListener('message', (e) => {
  const m = JSON.parse(typeof e.data === 'string' ? e.data : e.data.toString());
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) rej(new Error(JSON.stringify(m.error)));
    else res(m.result);
    return;
  }
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
    consoleErrors.push(m.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
  }
  if (m.method === 'Runtime.exceptionThrown') {
    const d = m.params.exceptionDetails;
    exceptions.push((d.text + ' ' + (d.exception?.description ?? '')).trim());
  }
});

const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params }));
  });

const ev = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
  return r.result.value;
};

const R = {};
const check = async (name, expression) => {
  try {
    R[name] = await ev(expression);
  } catch (e) {
    R[name] = { error: String(e.message).slice(0, 240) };
  }
};

await send('Runtime.enable');
await send('Log.enable');
await send('Network.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: PAGE });

for (let i = 0; i < 40; i++) {
  await sleep(500);
  const count = await ev(`document.querySelectorAll('section[id] [role="log"]').length`);
  if (count === 4) break;
}
await sleep(1200);

await check(
  'structure',
  `(() => {
    const ids = ['klara', 'eliska', 'tom', 'anna'];
    return {
      assistants: ids.filter((i) => document.getElementById(i)).length,
      chats: document.querySelectorAll('section[id] [role="log"]').length,
      inputs: document.querySelectorAll('section[id] input').length,
      headings: ids.map((i) => document.getElementById(i).querySelector('h2').textContent.trim()),
      chipCounts: ids.map((i) => [...document.getElementById(i).querySelectorAll('button')].filter((b) => b.type === 'button').length),
    };
  })()`,
);

await check(
  'chipClickAndIsolation',
  `(async () => {
    const root = document.getElementById('klara');
    const log = root.querySelector('[role="log"]');
    const chip = [...root.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Jaká je vaše otevírací doba?');
    if (!chip) return { ok: false, reason: 'chip nenalezen' };
    chip.click();
    const loadingSeen = await new Promise((res) => {
      const t0 = performance.now();
      const tick = () => {
        if (log.getAttribute('aria-busy') === 'true') return res(true);
        if (performance.now() - t0 > 1500) return res(false);
        requestAnimationFrame(tick);
      };
      tick();
    });
    await new Promise((r) => setTimeout(r, 2600));
    const rd = (i) => document.getElementById(i).querySelector('[role="log"]').innerText;
    return {
      answerShown: log.innerText.includes('od 9:00 do 19:00'),
      loadingSeen,
      questionEchoed: log.innerText.includes('otevírací doba'),
      annaLeak: rd('anna').includes('od 9:00 do 19:00'),
      tomLeak: rd('tom').includes('od 9:00 do 19:00'),
      annaGreeting: rd('anna').includes('tady Anna'),
    };
  })()`,
);