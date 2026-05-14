import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// Transition handling moved to PageTransitionProvider in layout
export default function PageTransition({ children }: PageTransitionProps) {
  return <>{children}</>;
}
