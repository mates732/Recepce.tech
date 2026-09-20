/* ============================================================
   TEXTIL LUDMILA – demo (Recepce.tech)
   1) Tracking – anonymní eventy do /track (JSONL, agregovatelné)
   2) Digitální recepční – hlasový asistent Vapi (reuse infrastruktury
      projektu: /config, /vapi-token, SDK z CDN)
   3) Drobné UI: reveal animace, parallax, mobilní menu, feedback
   ============================================================ */

(() => {
  "use strict";

  /* ==========================================================
     1) TRACKING
     - Anonymní session ID (UUID v sessionStorage), žádné osobní údaje.
     - Eventy: page_open, session_start, page_duration, section_view,
       assistant_open, assistant_interaction, video_play/progress/complete,
       feedback.
     - Struktura je stabilní, aby denní souhrn (Telegram bot Recepce.tech)
       mohl agregovat návštěvy, sessions, čas, asistenta i feedback.
     ========================================================== */

  const TRACK_URL = "/track";

  function makeId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "sid-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  let sessionId;
  try {
    sessionId = sessionStorage.getItem("tl_sid");
    if (!sessionId) {
      sessionId = makeId();
      sessionStorage.setItem("tl_sid", sessionId);
    }
  } catch (e) {
    sessionId = makeId();
  }

  // "session_start" jen jednou za session (page_open jde vždy).
  let sendSessionStart = true;
  try {
    if (sessionStorage.getItem("tl_ss") === "1") sendSessionStart = false;
    else sessionStorage.setItem("tl_ss", "1");
  } catch (e) { /* prywatní režim – pošleme, nic se nerozbije */ }

  const pageLoadedAt = performance.now();
  let heartbeatSentSeconds = 0;

  function postByFetch(payload) {
    try {
      return fetch(TRACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch (e) { return Promise.resolve(); }
  }

  function postByBeacon(payload) {
    try {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      if (navigator.sendBeacon && navigator.sendBeacon(TRACK_URL, blob)) return true;
    } catch (e) { /* spadneme na fetch keepalive níže */ }
    postByFetch(payload);
    return false;
  }

  function track(name, props, opts) {
    const event = {
      name,
      ts: Date.now(),
      sid: sessionId,
      page: location.pathname.split("/").pop() || "demo",
      props: props || {},
    };
    if (opts && opts.beacon) postByBeacon({ events: [event] });
    else postByFetch({ events: [event] });
  }

  // Otevření stránky + start session.
  track("page_open", { ref: document.referrer ? "external" : "direct" });
  if (sendSessionStart) track("session_start");

  // page_duration – srdeční tep každých 30 s + zbytek při odchodu.
  // Díky delta údajům agregace zvládne i zavřený tab bez pagehide.
  function sendDuration(beacon) {
    const total = Math.round((performance.now() - pageLoadedAt) / 1000);
    const delta = Math.max(0, total - heartbeatSentSeconds);
    if (delta < 2) return;
    heartbeatSentSeconds = total;
    track("page_duration", { seconds: delta, kind: beacon ? "final" : "heartbeat" }, { beacon });
  }
  setInterval(() => sendDuration(false), 30000);
  window.addEventListener("pagehide", () => sendDuration(true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") sendDuration(true);
  });

  // section_view – jen jednou pro každou sekci, při 40 % viditelnosti.
  const trackedSections = new WeakSet();
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || trackedSections.has(entry.target)) continue;
      trackedSections.add(entry.target);
      sectionObserver.unobserve(entry.target);
      track("section_view", { section: entry.target.dataset.track });
    }
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-track]").forEach((el) => sectionObserver.observe(el));

  /* ==========================================================
     Drobné UI – navbar, mobilní menu, reveal, parallax
     ========================================================== */

  const nav = document.querySelector(".nav");
  const onScrollNav = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal, .chat-demo").forEach((el) => revealObserver.observe(el));

  // Jemný parallax na hero fotce (jen desktop, jen bez reduced motion).
  const heroImg = document.querySelector(".hero-photo img");
  if (heroImg && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          heroImg.style.transform = "translateY(" + (y * 0.06).toFixed(1) + "px) scale(1.06)";
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ==========================================================
     2) DIGITÁLNÍ RECEPTČNÍ (Vapi voice assistant)
     Logika převzatá z testovací stránky projektu (index.html):
       /config -> publicKey + assistantId (fallback režim)
       /vapi-token -> krátkodobý JWT (secure mode)
     ========================================================== */

  const FALLBACK_CONFIG = {
    publicKey: "0e329649-855b-4866-8219-3c5737d30901",
    assistantId: "95097678-68e0-47f7-b3ac-a013b1a20a95",
  };
  const SDK_URLS = [
    "https://esm.sh/@vapi-ai/web@2.7.1",
    "https://cdn.jsdelivr.net/npm/@vapi-ai/web@2.7.1/+esm",
  ];

  const widget = document.getElementById("assistantWidget");
  const statusEl = document.getElementById("wStatus");
  const callBtn = document.getElementById("wCallBtn");
  const transcriptEl = document.getElementById("wTranscript");
  const chipsEl = document.getElementById("wChips");

  const state = {
    vapi: null,
    mode: null,
    callActive: false,
    busy: false,
    partial: null,
    cleared: false,
    pendingQuestion: null,
    assistantOpenTracked: false,
  };

  function setStatus(text, busy) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.toggle("busy", Boolean(busy));
  }

  function trackAssistantOpen(action) {
    if (state.assistantOpenTracked) return;
    state.assistantOpenTracked = true;
    track("assistant_open", { action: action || "unknown" });
  }

  function describeError(value, depth) {
    depth = depth || 0;
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (value instanceof Error) return value.message || value.name || "Error";
    if (depth > 5) {
      try { return JSON.stringify(value); } catch (e) { return Object.prototype.toString.call(value); }
    }
    const keys = ["message", "msg", "error", "errorMsg", "errorMessage", "title",
      "detail", "reason", "code", "status", "statusCode", "stage"];
    for (const key of keys) {
      if (value[key] !== undefined && value[key] !== null) {
        const text = describeError(value[key], depth + 1);
        if (text) return text;
      }
    }
    try { return JSON.stringify(value); } catch (e) { return Object.prototype.toString.call(value); }
  }

  function friendlyError(error) {
    const text = describeError(error) || "neznámá chyba";
    if (error && error.type === "audio-start-failed") {
      return "Prohlížeč zablokoval zvuk – zkuste tlačítko znovu.";
    }
    if (/doesn'?t allow|not allowed.*assistant/i.test(text) || (/\b403\b|forbidden/i.test(text) && /assistant|key/i.test(text))) {
      return "Hovor byl odmítnut (403) – zkontrolujte Vapi konfiguraci (secure mode).";
    }
    if (/\b401\b|unauthorized|invalid.*key/i.test(text)) {
      return "Odmítnut klíč (401) – zkontrolujte VAPI_PUBLIC_KEY.";
    }
    if (/\b404\b|not found/i.test(text) && /assistant/i.test(text)) {
      return "Asistent nenalezen (404) – zkontrolujte ASSISTANT_ID.";
    }
    if (/permission|notallowed|denied/i.test(text) && !/\b403\b/.test(text)) {
      return "Přístup k mikrofonu byl zamítnut – povolte ho v prohlížeči a zkuste znovu.";
    }
    return "Něco se nepovedlo (" + text.slice(0, 90) + "). Zkuste to prosím znovu.";
  }

  async function loadConfig() {
    const params = new URLSearchParams(location.search);
    const override = {
      publicKey: params.get("publicKey"),
      assistantId: params.get("assistantId"),
    };
    try {
      const response = await fetch("/config", { cache: "no-store" });
      if (response.ok) {
        const fromServer = await response.json();
        return {
          publicKey: override.publicKey || fromServer.publicKey || FALLBACK_CONFIG.publicKey,
          assistantId: override.assistantId || fromServer.assistantId || FALLBACK_CONFIG.assistantId,
        };
      }
    } catch (e) { /* použijeme fallback */ }
    return {
      publicKey: override.publicKey || FALLBACK_CONFIG.publicKey,
      assistantId: override.assistantId || FALLBACK_CONFIG.assistantId,
    };
  }

  async function fetchVapiToken() {
    const response = await fetch("/vapi-token", { cache: "no-store" });
    let data = null;
    try { data = await response.json(); } catch (e) { /* ne-JSON odpověď */ }
    if (!response.ok) {
      if (response.status === 503) {
        return { secureAvailable: false, message: data && data.error ? data.error : "není nakonfigurován" };
      }
      throw new Error(data && data.error ? data.error : "HTTP " + response.status);
    }
    if (!data.token) {
      if (data.fallbackPublicKey) return { secureAvailable: false, fallbackPublicKey: data.fallbackPublicKey };
      throw new Error("server nevrátil token");
    }
    data.secureAvailable = true;
    return data;
  }

  // Probuzení audio kontextu, aby prohlížeč pustil zvuk okamžitě po kliku.
  function unlockAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.01);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.01);
    } catch (e) { /* ticho – jde jen o probuzení */ }
  }

  function appendBubble(role, label, text) {
    if (!state.cleared) {
      transcriptEl.hidden = false;
      transcriptEl.innerHTML = "";
      state.cleared = true;
    }
    const bubble = document.createElement("div");
    bubble.className = "w-bubble " + role;
    const who = document.createElement("span");
    who.className = "who";
    who.textContent = label;
    const body = document.createElement("span");
    body.className = "text";
    body.textContent = text;
    bubble.append(who, body);
    transcriptEl.appendChild(bubble);
    transcriptEl.scrollTop = transcriptEl.scrollHeight;
    return { role, bubble, body };
  }

  function renderTranscript(message) {
    if (!message || typeof message !== "object" || message.type !== "transcript") return;
    const role = message.role === "user" ? "user" : "assistant";
    const label = role === "user" ? "Vy" : "Recepční";
    const text = (message.transcript || "").trim();
    if (!text) return;

    if (message.transcriptType === "partial") {
      const last = transcriptEl.lastElementChild;
      if (!state.partial || state.partial.role !== role || state.partial.bubble !== last) {
        state.partial = appendBubble(role, label, text);
      }
      state.partial.body.textContent = text;
      state.partial.bubble.classList.add("partial");
      transcriptEl.scrollTop = transcriptEl.scrollHeight;
      return;
    }

    const last = transcriptEl.lastElementChild;
    if (state.partial && state.partial.role === role && state.partial.bubble === last) {
      state.partial.body.textContent = text;
      state.partial.bubble.classList.remove("partial");
      state.partial = null;
    } else {
      appendBubble(role, label, text);
    }
  }

  function getVapi(mode, credential, VapiClass, assistantId) {
    if (!state.vapi || state.mode !== mode) {
      if (state.vapi && state.vapi.stop) {
        try { state.vapi.stop(); } catch (e) { /* ignorovat */ }
      }
      state.vapi = new VapiClass(credential);
      state.mode = mode;
      attachListeners(state.vapi, assistantId);
    }
    return state.vapi;
  }

  function attachListeners(instance, assistantId) {
    instance.on("call-start", () => {
      state.callActive = true;
      state.busy = false;
      callBtn.textContent = "Ukončit hovor";
      callBtn.classList.add("stop");
      setStatus("Hovor běží – mluvte, recepční poslouchá", false);
      track("assistant_interaction", { action: "call_start" });

      // Pokud uživatel klikl na otázku před hovorem, předáme ji asistentovi.
      if (state.pendingQuestion) {
        const q = state.pendingQuestion;
        state.pendingQuestion = null;
        setTimeout(() => injectQuestion(q), 1200);
      }
    });

    instance.on("call-end", () => {
      state.callActive = false;
      state.busy = false;
      state.partial = null;
      callBtn.textContent = "Promluvit si s recepční";
      callBtn.classList.remove("stop");
      setStatus("Hovor ukončen – recepční je zpět k dispozici", false);
      widget.classList.remove("speaking");
      track("assistant_interaction", { action: "call_end" });
    });

    instance.on("speech-start", () => widget.classList.add("speaking"));
    instance.on("speech-end", () => widget.classList.remove("speaking"));

    instance.on("message", (message) => {
      if (message && message.type === "transcript") renderTranscript(message);
    });

    instance.on("call-start-failed", (info) => {
      state.busy = false;
      setStatus("Hovor se nepodařilo zahájit – zkuste to znovu", false);
      track("assistant_interaction", { action: "call_start_failed" });
    });

    instance.on("error", (error) => {
      state.busy = false;
      const text = friendlyError(error);
      setStatus(text, false);
      track("assistant_interaction", { action: "error", detail: String(error && error.type || "unknown").slice(0, 40) });
    });
  }

  // Textový vstup do hovoru – Vapi "add-message" řečí zákazníka.
  // Díky tomu jsou doporučené otázky skutečně použitelné.
  function injectQuestion(question) {
    if (!state.vapi || !state.callActive) return false;
    try {
      if (typeof state.vapi.send !== "function") return false;
      state.vapi.send({
        type: "add-message",
        message: { role: "user", content: question },
      });
      appendBubble("user", "Vy", question);
      track("assistant_interaction", { action: "question", question: String(question).slice(0, 120) });
      return true;
    } catch (e) {
      track("assistant_interaction", { action: "question_send_failed" });
      return false;
    }
  }

  async function startCall(PUBLIC_KEY, ASSISTANT_ID, VapiClass) {
    if (state.busy || state.callActive) return;
    state.busy = true;
    trackAssistantOpen("call_button");
    setStatus("Připojuji recepční…", true);
    callBtn.disabled = true;

    try {
      unlockAudio();
      await new Promise((r) => setTimeout(r, 150));

      try {
        const tokenData = await fetchVapiToken();
        if (tokenData.secureAvailable) {
          const instance = getVapi("secure", tokenData.token, VapiClass, tokenData.assistantId || ASSISTANT_ID);
          const result = await instance.start(tokenData.assistantId || ASSISTANT_ID);
          if (result === null) throw new Error("start() vrátilo null");
        } else {
          const credential = tokenData.fallbackPublicKey || PUBLIC_KEY;
          const instance = getVapi("fallback", credential, VapiClass, ASSISTANT_ID);
          const result = await instance.start(ASSISTANT_ID);
          if (result === null) throw new Error("start() vrátilo null");
        }
      } catch (secureError) {
        // Pojistka: klasický public key start.
        const instance = getVapi("fallback", PUBLIC_KEY, VapiClass, ASSISTANT_ID);
        const result = await instance.start(ASSISTANT_ID);
        if (result === null) throw new Error("start() vrátilo null");
      }
    } catch (error) {
      state.busy = false;
      setStatus(friendlyError(error), false);
      track("assistant_interaction", { action: "start_failed" });
    } finally {
      callBtn.disabled = false;
    }
  }

  function askQuestion(question, PUBLIC_KEY, ASSISTANT_ID, VapiClass) {
    trackAssistantOpen("suggested_question");
    if (state.callActive) {
      if (!injectQuestion(question)) {
        setStatus("Recepční teď nemůže přijmout otázku – zkuste to za chvíli.", true);
      }
      return;
    }
    state.pendingQuestion = question;
    setStatus("Spouštím hovor a předávám otázku…", true);
    startCall(PUBLIC_KEY, ASSISTANT_ID, VapiClass);
  }

  async function initAssistant() {
    if (!window.isSecureContext) {
      setStatus("Mikrofon funguje jen na https:// nebo localhost", false);
      callBtn.disabled = true;
      return;
    }

    const { publicKey: PUBLIC_KEY, assistantId: ASSISTANT_ID } = await loadConfig();

    let VapiClass = null;
    for (const url of SDK_URLS) {
      try {
        const module = await import(url);
        VapiClass = module.default;
        break;
      } catch (e) { /* zkusíme další CDN */ }
    }

    if (!VapiClass || !ASSISTANT_ID) {
      setStatus("Hlasová recepční není v této ukázce dostupná – napište nám.", false);
      callBtn.disabled = true;
      chipsEl.querySelectorAll(".w-chip").forEach((chip) => { chip.disabled = true; });
      return;
    }

    setStatus("Připravena odpovědět", false);

    // E-mail – tracknout, ať jde vidět i „psaný" kontakt.
    const mailBtn = document.getElementById("wMailBtn");
    if (mailBtn) {
      mailBtn.addEventListener("click", () => {
        trackAssistantOpen("email_button");
        track("assistant_interaction", { action: "email" });
      });
    }

    callBtn.addEventListener("click", () => {
      if (state.callActive) {
        state.busy = true;
        setStatus("Ukončuji hovor…", true);
        try { state.vapi.stop(); } catch (e) { /* call-end přijde sám */ }
      } else {
        startCall(PUBLIC_KEY, ASSISTANT_ID, VapiClass);
      }
    });

    chipsEl.addEventListener("click", (e) => {
      const chip = e.target.closest(".w-chip");
      if (!chip) return;
      askQuestion(chip.dataset.question, PUBLIC_KEY, ASSISTANT_ID, VapiClass);
    });

    // "Zeptat se recepční" u služeb – předdotá otázka a otevře widget.
    document.querySelectorAll("[data-ask]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const question = el.dataset.ask;
        document.getElementById("recepce").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        askQuestion(question, PUBLIC_KEY, ASSISTANT_ID, VapiClass);
      });
    });
  }

  initAssistant();

  /* ==========================================================
     3) FEEDBACK  (👍 / 😒 / 👎)
     ========================================================== */

  const fbButtons = document.querySelectorAll(".fb-btn");
  const fbArea = document.getElementById("feedbackArea");
  fbButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.value; // up | neutral | down
      track("feedback", { value });
      fbArea.innerHTML = '<p class="fb-thanks">Díky za zpětnou vazbu.</p>';
    });
  });
})();
