"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

const DESIGN_WIDTH = 1440;

export default function ScaleContainer({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      setScale(Math.min(1, window.innerWidth / DESIGN_WIDTH));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (scale >= 1) {
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
        ref={contentRef}
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
