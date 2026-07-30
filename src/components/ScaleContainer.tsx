"use client";

import { useEffect, useState, ReactNode } from "react";

const DESIGN_WIDTH = 1440;
const MOBILE_THRESHOLD = 480;

export default function ScaleContainer({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const mobile = w <= MOBILE_THRESHOLD;
      setIsMobile(mobile);
      setScale(mobile ? w / DESIGN_WIDTH : 1);
      document.documentElement.setAttribute("data-scaled", mobile ? "true" : "false");
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      document.documentElement.removeAttribute("data-scaled");
    };
  }, []);

  if (!isMobile || scale >= 1) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          width: `${DESIGN_WIDTH}px`,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
