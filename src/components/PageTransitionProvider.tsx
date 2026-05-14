"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { type ReactNode, useEffect, useRef } from "react";

interface Props {
  children: ReactNode;
}

export default function PageTransitionProvider({ children }: Props) {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={first.current ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
