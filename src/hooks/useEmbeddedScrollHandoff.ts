"use client";

import { useEffect, useRef } from "react";

export function useEmbeddedScrollHandoff(
  iframeRef: React.RefObject<HTMLIFrameElement | null>
) {
  const lastScrollYRef = useRef(0);

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

  function isInView(): boolean {
    if (!iframeRef.current) return false;
    const rect = iframeRef.current.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

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
    function handleScroll() {
      if (!iframeRef.current || !isInView()) return;

      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (isScrollingUp && !isIframeDisabled()) {
        disableIframe();
      } else if (!isScrollingUp && isIframeDisabled()) {
        enableIframe();
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [iframeRef]);
}
