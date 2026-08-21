import type { Locale } from "@/lib/types";
import { getPage } from "@/content/repository";
import type { SectionType } from "@/content/types";
import { SECTION_TYPES } from "@/content/sections";
import HeroSection from "@/components/sections/HeroSection";
import LaboratorySection from "@/components/sections/LaboratorySection";
import LiveSystemsSection from "@/components/sections/LiveSystemsSection";
import SystemsAuditSection from "@/components/sections/SystemsAuditSection";
import SystemsSection from "@/components/sections/SystemsSection";

import TrustProofSection from "@/components/sections/TrustProofSection";
import AudienceSection from "@/components/sections/AudienceSection";
import WhatWeBuildSection from "@/components/sections/WhatWeBuildSection";
import ControlRoomSection from "@/components/sections/ControlRoomSection";
import ExperimentsSection from "@/components/sections/ExperimentsSection";
import EcosystemSection from "@/components/sections/EcosystemSection";
import ProcessSection from "@/components/sections/ProcessSection";
import YoutubeSection from "@/components/sections/YoutubeSection";
import AboutSection from "@/components/sections/AboutSection";
import FinalCtaSection from "@/components/sections/FinalCtaSection";


interface EcosystemHomeProps {
  locale: Locale;
}

const SECTION_COMPONENTS: Record<SectionType, (props: { locale: Locale }) => React.ReactNode> = {
  hero: (props) => <HeroSection {...props} />,
  laboratory: (props) => <LaboratorySection {...props} />,
  liveSystems: (props) => <LiveSystemsSection {...props} />,
  systemsAudit: (props) => <SystemsAuditSection {...props} />,
  systems: (props) => <SystemsSection {...props} />,
  caseStudies: () => null,
  trustProof: (props) => <TrustProofSection {...props} />,
  audience: (props) => <AudienceSection {...props} />,
  whatWeBuild: (props) => <WhatWeBuildSection {...props} />,
  controlRoom: (props) => <ControlRoomSection {...props} />,
  experiments: (props) => <ExperimentsSection {...props} />,
  ecosystem: (props) => <EcosystemSection {...props} />,
  process: (props) => <ProcessSection {...props} />,
  youtube: (props) => <YoutubeSection {...props} />,
  about: (props) => <AboutSection {...props} />,
  finalCta: (props) => <FinalCtaSection {...props} />,
};

function defaultSectionOrder(): SectionType[] {
  return SECTION_TYPES.map((meta) => meta.type);
}

export default function EcosystemHome({ locale }: EcosystemHomeProps) {
  const page = getPage("home");
  const order = page?.data.sections
    ? page.data.sections.filter((s) => s.visible).map((s) => s.section)
    : defaultSectionOrder();

  return (
    <div className="relative">
      {order.map((type) => {
        const render = SECTION_COMPONENTS[type];
        if (!render) return null;
        return (
          <div key={type} className="relative">
            {render({ locale })}
          </div>
        );
      })}
    </div>
  );
}
