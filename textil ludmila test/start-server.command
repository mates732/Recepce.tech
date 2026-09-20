#!/bin/bash
# Spustí lokální webový server (npm run dev) a otevře testovací stránku
# s Vapi asistentem. Dvojklikem v Finderu, nebo v terminálu: ./start-server.command
# Ukončení: Ctrl+C

cd "$(dirname "$0")" || exit 1

PORT="${PORT:-8000}"
URL="http://localhost:$PORT/index.html"

echo "Server běží na $URL (mikrofon funguje jen na localhost)."
echo "Ukončete tento proces pomocí Ctrl+C."

( sleep 1; open "$URL" ) &

# Preferujeme npm run dev (server.mjs – secure mode s krátkodobými tokeny).
if command -v node >/dev/null 2>&1; then
    exec npm run dev
fi

# Záloha bez Node: python verze umí totéž (i /vapi-token).
if command -v python3 >/dev/null 2>&1; then
    echo "Node nenalezen – spouštím python záložní server (dev/server.py)."
    exec python3 dev/server.py
fi

echo "Chyba: nenalezen ani node, ani python3." >&2
exit 1
