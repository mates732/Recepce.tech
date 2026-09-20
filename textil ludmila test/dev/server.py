#!/usr/bin/env python3
"""Lokální server pro testovací stránku Vapi asistenta.

Kromě statických souborů (index.html) nabízí endpoint /config,
který přečte .env a vrátí veřejné Vapi údaje:

    VAPI_PUBLIC_KEY -> publicKey
    ASSISTANT_ID    -> assistantId

Do prohlížeče se dostanou jen tyto dvě hodnoty – žádné soukromé
proměnné z .env se na klienta nikdy nepošlou (Vapi public key je
pro veřejné použití v prohlížeči určený).

Spuštění: python3 server.py   (případně ./start-server.command)
"""

import base64
import hashlib
import hmac
import json
import os
import re
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Hodnoty smí vyčíst jen z proměnných končících na PUBLIC_KEY (Vapi
# public key) nebo ASSISTANT_ID. Soukromé klíče (např. *_API_KEY,
# *_PRIVATE_KEY, *_SECRET) se tímto filtrem do prohlížeče nedostanou.
PUBLIC_KEY_PATTERN = re.compile(r"PUBLIC_KEY$")
ASSISTANT_ID_PATTERN = re.compile(r"ASSISTANT_ID$")


def load_env(path):
    """Jednoduchý čtečka .env: KEY=VALUE, komentáře a prázdné řádky ignoruje."""
    values = {}
    try:
        with open(path, encoding="utf-8") as handle:
            for raw_line in handle:
                line = raw_line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                name, _, value = line.partition("=")
                name = name.strip()
                value = value.strip().strip('"').strip("'")
                if name:
                    values[name] = value
    except OSError:
        pass
    return values


def public_config():
    env = load_env(os.path.join(ROOT, ".env"))
    config = {}
    for name, value in env.items():
        if not value:
            continue
        if PUBLIC_KEY_PATTERN.search(name):
            config["publicKey"] = value
        elif ASSISTANT_ID_PATTERN.search(name):
            config["assistantId"] = value
    return config


def env_value(name):
    """Hodnota z procesního prostředí má přednost před .env souborem."""
    return os.environ.get(name) or load_env(os.path.join(ROOT, ".env")).get(name, "")


def b64url(data):
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def create_public_vapi_jwt(assistant_id, allowed_origin):
    """Veřejný Vapi JWT (HS256) – viz docs.vapi.ai/customization/jwt-authentication.

    Podepsán soukromým klíčem, který opouští server jen v podobě
    krátkodobého tokenu omezeného na asistenta a povolené originy.
    """
    private_key = env_value("VAPI_PRIVATE_KEY")
    org_id = env_value("ORG_ID")

    header = b64url(json.dumps({"alg": "HS256", "typ": "JWT"},
                               separators=(",", ":")).encode("utf-8"))
    now = int(time.time())
    payload = {
        "orgId": org_id,
        "iat": now,
        "exp": now + 1800,  # platnost 30 minut
        "token": {
            "tag": "public",
            "restrictions": {
                "enabled": True,
                "allowedOrigins": [allowed_origin],
                "allowedAssistantIds": [assistant_id],
                "allowTransientAssistant": False,
            },
        },
    }
    payload_b64 = b64url(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = (header + "." + payload_b64).encode("ascii")
    signature = hmac.new(private_key.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return header + "." + payload_b64 + "." + b64url(signature)


class RequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def _send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/config":
            config = public_config()
            config["secureMode"] = False
            self._send_json(config)
        elif path == "/vapi-token":
            config = public_config()
            assistant_id = config.get("assistantId", "")
            private_key = env_value("VAPI_PRIVATE_KEY")
            org_id = env_value("ORG_ID")
            if not private_key or not org_id:
                self._send_json({
                    "error": "Secure mode není nakonfigurován – doplňte VAPI_PRIVATE_KEY a ORG_ID do .env."
                }, status=503)
                return
            origin = os.environ.get("ALLOWED_ORIGIN") or "http://localhost:%d" % self.server.server_port
            self._send_json({
                "token": create_public_vapi_jwt(assistant_id, origin),
                "assistantId": assistant_id,
                "expiresIn": 1800,
                "secureMode": True,
            })
        else:
            super().do_GET()


def main():
    port = int(os.environ.get("PORT", "8000"))
    config = public_config()
    has_secure = bool(env_value("VAPI_PRIVATE_KEY") and env_value("ORG_ID"))

    server = ThreadingHTTPServer(("127.0.0.1", port), RequestHandler)
    print("Server běží na http://localhost:%d/index.html" % port)
    print("  /config     -> publicKey: %s, assistantId: %s" % (
        "nalezeno" if "publicKey" in config else "CHYBÍ",
        "nalezeno" if "assistantId" in config else "CHYBÍ",
    ))
    print("  /vapi-token -> secure mode: %s" % ("AKTIVNÍ" if has_secure else "není nakonfigurován (VAPI_PRIVATE_KEY / ORG_ID)"))
    print("Ukončete tento proces pomocí Ctrl+C.")
    server.serve_forever()


if __name__ == "__main__":
    main()
