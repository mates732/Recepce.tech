export interface VapiAssistantConfig {
  assistantId: string;
  apiKey: string;
}

export const VAPI_ASSISTANTS: Record<string, VapiAssistantConfig> = {
  barbershop: {
    assistantId: "799b5718-916e-4f51-84b5-ab4c3d68b171",
    apiKey: "202bc2ca-6cf1-4e3e-a339-002a207b000f",
  },
  "dentalni-hygiena": {
    assistantId: "e7a23310-d13b-463e-ad41-68620a609b34",
    apiKey: "ba1d1d22-bb87-4206-baaa-63b4e1871e26",
  },
  "esteticka-klinika": {
    assistantId: "586304c3-6eab-489a-9efe-e71f8c05f29b",
    apiKey: "c2aba488-b8d1-45b7-8962-30930ca57f57",
  },
  fitness: {
    assistantId: "7782faee-5e40-436e-a4ff-6b4a65578d1e",
    apiKey: "84232e9d-72de-4265-943e-4fc4a6794d5e",
  },
  kaderstvi: {
    assistantId: "ee61d280-74ad-42b1-8148-a530b4af4bc7",
    apiKey: "5b6584ac-b22c-4d0f-8a32-ae093cbe1b5c",
  },
  masaze: {
    assistantId: "3af1e2a6-64bb-4504-8522-99df5aefa852",
    apiKey: "c109c3eb-0db8-4f88-a782-b19d8f6e7d03",
  },
  stomatologie: {
    assistantId: "ee4bfda8-e608-4583-84ff-593639ff5f7b",
    apiKey: "fb72fadc-f8f5-4738-98fa-bb7277790486",
  },
};

export function getVapiConfig(slug: string): VapiAssistantConfig | undefined {
  return VAPI_ASSISTANTS[slug];
}
