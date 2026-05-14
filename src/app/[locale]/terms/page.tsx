import type { Locale } from "@/lib/types";
import PageTransition from "@/components/PageTransition";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const loc = locale as Locale;
  const isCs = loc === "cs";

  return (
    <PageTransition>
      <section className="relative w-full pt-[clamp(120px,16vh,180px)] pb-24 px-[clamp(24px,5vw,64px)]">
        <div className="mx-auto max-w-[720px]">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(183,188,199,0.7)",
            }}
          >
            <span className="font-body text-[10px] tracking-[0.08em]">{isCs ? "Právní" : "Legal"}</span>
          </div>

          <h1
            className="font-heading mb-10"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              lineHeight: 1.15,
              fontWeight: 500,
            }}
          >
            {isCs ? "Obchodní podmínky" : "Terms of Service"}
          </h1>

          <div className="space-y-6 font-body text-[15px] leading-relaxed" style={{ color: "#B7BCC7" }}>
            {isCs ? (
              <>
                <p>Používáním této webové stránky a služeb recepce.tech souhlasíte s následujícími obchodními podmínkami.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Služby</h2>
                <p>recepce.tech poskytuje AI asistenční služby pro příjem hovorů, správu rezervací a komunikaci se zákazníky. Konkrétní rozsah služeb je vždy definován individuální smlouvou.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Platby</h2>
                <p>Cena služeb je stanovena na základě konfigurace a individuální nabídky. Platby jsou prováděny měsíčně na základě vystavené faktury.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Zrušení</h2>
                <p>Službu můžete kdykoliv zrušit bez sankcí a bez výpovědní doby. V případě zrušení vám zajistíme export všech vašich dat.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Odpovědnost</h2>
                <p>recepce.tech garantuje 99,9% dostupnost služby. Neručíme za výpadky způsobené třetími stranami (poskytovatelé telekomunikačních služeb, API služby atd.).</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Kontakt</h2>
                <p>Veškeré dotazy ohledně obchodních podmínek směřujte na vojanmatyas@gmail.com.</p>
                <p className="mt-8 font-body text-[13px]" style={{ color: "rgba(126,132,146,0.8)" }}>Poslední aktualizace: leden 2026</p>
              </>
            ) : (
              <>
                <p>By using this website and recepce.tech services, you agree to the following terms and conditions.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Services</h2>
                <p>recepce.tech provides AI assistance services for call handling, booking management, and customer communication. The specific scope of services is defined in the individual agreement.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Payments</h2>
                <p>Service pricing is based on configuration and individual offer. Payments are made monthly based on issued invoice.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Cancellation</h2>
                <p>You may cancel the service at any time without penalties or notice period. Upon cancellation, we will ensure export of all your data.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Liability</h2>
                <p>recepce.tech guarantees 99.9% service availability. We are not liable for outages caused by third parties (telecommunications providers, API services, etc.).</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Contact</h2>
                <p>Direct all questions regarding terms of service to vojanmatyas@gmail.com.</p>
                <p className="mt-8 font-body text-[13px]" style={{ color: "rgba(126,132,146,0.8)" }}>Last updated: January 2026</p>
              </>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
