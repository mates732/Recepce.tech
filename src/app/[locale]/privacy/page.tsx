import type { Locale } from "@/lib/types";
import PageTransition from "@/components/PageTransition";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: Props) {
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
            {isCs ? "Ochrana soukromí" : "Privacy Policy"}
          </h1>

          <div className="space-y-6 font-body text-[15px] leading-relaxed" style={{ color: "#B7BCC7" }}>
            {isCs ? (
              <>
                <p>Vaše soukromí je pro nás důležité. Tato stránka vysvětluje, jaké údaje shromažďujeme, proč je shromažďujeme a jak je chráníme.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Jaké údaje shromažďujeme</h2>
                <p>Shromažďujeme pouze údaje, které nám dobrovolně poskytnete prostřednictvím kontaktního formuláře — jméno, e-mailovou adresu a telefonní číslo. Tyto údaje používáme výhradně pro komunikaci s vámi ohledně vaší poptávky.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Cookies</h2>
                <p>Náš web používá pouze nezbytné technické cookies pro zajištění správné funkčnosti. Nepoužíváme sledovací ani marketingové cookies třetích stran.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Sdílení údajů</h2>
                <p>Vaše údaje nikdy nesdílíme s třetími stranami, s výjimkou případů, kdy to vyžaduje zákon. Vaše data jsou bezpečně uložena na serverech v EU.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Vaše práva</h2>
                <p>Máte právo kdykoliv požádat o výpis, úpravu nebo smazání svých osobních údajů. Stačí nám napsat na vojanmatyas@gmail.com.</p>
                <p className="mt-8 font-body text-[13px]" style={{ color: "rgba(126,132,146,0.8)" }}>Poslední aktualizace: leden 2026</p>
              </>
            ) : (
              <>
                <p>Your privacy matters to us. This page explains what data we collect, why we collect it, and how we protect it.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">What data we collect</h2>
                <p>We only collect data you voluntarily provide through our contact form — name, email address, and phone number. This data is used exclusively to communicate with you about your inquiry.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Cookies</h2>
                <p>Our website uses only essential technical cookies to ensure proper functionality. We do not use third-party tracking or marketing cookies.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Data sharing</h2>
                <p>We never share your data with third parties, except when required by law. Your data is securely stored on EU-based servers.</p>
                <h2 className="font-heading text-[18px] font-medium text-[#F3F4F6] mt-8 mb-3">Your rights</h2>
                <p>You have the right to request access, modification, or deletion of your personal data at any time. Just write to us at vojanmatyas@gmail.com.</p>
                <p className="mt-8 font-body text-[13px]" style={{ color: "rgba(126,132,146,0.8)" }}>Last updated: January 2026</p>
              </>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
