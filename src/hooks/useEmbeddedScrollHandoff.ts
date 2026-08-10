"use client";

import { useEffect, useRef } from "react";
import { useScrollY } from "@/lib/scroll";

export function useEmbeddedScrollHandoff(
  iframeRef: React.RefObject<HTMLIFrameElement | null>
) {
  const lastScrollYRef = useRef(0);
  const cachedTopRef = useRef<number | null>(null);
  const cachedHeightRef = useRef(0);
  const scrollY = useScrollY();

  function isIframeDisabled(): boolean {
    return iframeRef.current?.style.pointerEvents === "none";
  }

  function disableIframe(): void {
    if (iframeRef.current) {
      iframeRef.current.style.pointerEvents = "none";
    }
  }

  function enableIframe(): void {
    if (iframeRef.current) {
      iframeRef.current.style.pointerEvents = "auto";
    }
  }

  function measure(): void {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const rect = iframe.getBoundingClientRect();
    cachedTopRef.current = rect.top + window.scrollY;
    cachedHeightRef.current = rect.height;
    lastScrollYRef.current = window.scrollY;
  }

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => {
      const top = cachedTopRef.current;
      if (top == null) return;
      const height = cachedHeightRef.current;
      const inView = top - y < window.innerHeight && top + height - y > 0;
      if (!inView) return;

      const isScrollingUp = y < lastScrollYRef.current;
      lastScrollYRef.current = y;

      if (isScrollingUp && !isIframeDisabled()) {
        disableIframe();
      } else if (!isScrollingUp && isIframeDisabled()) {
        enableIframe();
      }
    });
    return unsub;
  }, [scrollY, iframeRef]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data;
      const type = typeof data === "string" ? data : data?.type;

      if (type === "zlaty-hreben-scroll-end" || type === "zlaty-hreben-scroll-start") {
        disableIframe();
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [iframeRef]);

  useEffect(() => {
    measure();
    const interval = setInterval(measure, 2000);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure, { once: true });
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", measure);
    };
  }, []);
}
