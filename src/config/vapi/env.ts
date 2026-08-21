import "server-only";

interface AssistantEnvVars {
  apiKey: string;
  assistantId: string;
}

const ASSISTANT_ENV_MAP: Record<string, AssistantEnvVars> = {
  barber: {
    apiKey: "VAPI_BARBER_API_KEY",
    assistantId: "VAPI_BARBER_ASSISTANT_ID",
  },
  dentist: {
    apiKey: "VAPI_DENTIST_API_KEY",
    assistantId: "VAPI_DENTIST_ASSISTANT_ID",
  },
  veterinary: {
    apiKey: "VAPI_VETERINARY_API_KEY",
    assistantId: "VAPI_VETERINARY_ASSISTANT_ID",
  },
  restaurant: {
    apiKey: "VAPI_RESTAURANT_API_KEY",
    assistantId: "VAPI_RESTAURANT_ASSISTANT_ID",
  },
  "hair-salon": {
    apiKey: "VAPI_HAIR_SALON_API_KEY",
    assistantId: "VAPI_HAIR_SALON_ASSISTANT_ID",
  },
  massage: {
    apiKey: "VAPI_MASSAGE_API_KEY",
    assistantId: "VAPI_MASSAGE_ASSISTANT_ID",
  },
  fitness: {
    apiKey: "VAPI_FITNESS_API_KEY",
    assistantId: "VAPI_FITNESS_ASSISTANT_ID",
  },
};

function readEnv(name: string): string {
  return process.env[name] ?? "";
}

/** Vrací veřejný (pk_) klíč a ID asistenta pro dané odvětví. */
export function getAssistantConfig(industry: string): { apiKey: string; assistantId: string } {
  const vars = ASSISTANT_ENV_MAP[industry];
  if (!vars) {
    throw new Error(
      `Unknown Vapi industry "${industry}". ` +
        `Available: ${Object.keys(ASSISTANT_ENV_MAP).join(", ")}`,
    );
  }
  return {
    apiKey: readEnv(vars.apiKey),
    assistantId: readEnv(vars.assistantId),
  };
}

export function validateVapiEnv(): void {
  if (process.env.NODE_ENV !== "development") return;

  const missing: string[] = [];
  const seen = new Set<string>();

  for (const [industry, vars] of Object.entries(ASSISTANT_ENV_MAP)) {
    for (const [label, envName] of Object.entries(vars)) {
      if (seen.has(envName)) continue;
      seen.add(envName);
      if (!process.env[envName]) {
        missing.push(`  ${envName}  (${industry} ${label})`);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required Vapi environment variables:\n` +
        missing.join("\n") +
        `\n\nAdd them to your .env file.`,
    );
  }
}
