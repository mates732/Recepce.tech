"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Client hranice pro framer-motion — MotionConfig volá useContext interně,
 * proto ho nesmí renderovat přímo Server Component. Tento obal zaručuje,
 * že MotionConfig vždy běží v client bundle (viz runtime chyba
 * "Cannot read properties of undefined (reading 'call')").
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
