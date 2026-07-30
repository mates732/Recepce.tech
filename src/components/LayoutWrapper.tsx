"use client";

import { ReactNode } from "react";
import ScaleContainer from "./ScaleContainer";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return <ScaleContainer>{children}</ScaleContainer>;
}
