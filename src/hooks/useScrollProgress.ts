'use client';

import { useEffect, useRef } from 'react';
import { useStore, type SectionId } from '@/store/useStore';

const SECTION_IDS: SectionId[] = [0, 1, 2, 3, 4];

export function useScrollProgress() {
  const setActiveSection = useStore((s) => s.setActiveSection);
  const setScrollProgress = useStore((s) => s.setScrollProgress);
  const setSectionProgress = useStore((s) => s.setSectionProgress);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const sectionElements: (HTMLElement | null)[] = SECTION_IDS.map(() => null);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const totalProgress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(totalProgress);

      // Find which section is most visible
      let maxVisibility = 0;
      let mostVisibleSection: SectionId = 0;

      SECTION_IDS.forEach((id) => {
        const el = sectionElements[id];
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const visibleHeight =
          Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibility = visibleHeight / windowHeight;

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleSection = id;
        }

        // Section progress (0-1 as section scrolls through viewport)
        if (id === mostVisibleSection || visibility > 0.3) {
          const sectionProgress = Math.max(
            0,
            Math.min(1, -rect.top / (windowHeight * 0.6))
          );
          if (id === mostVisibleSection) {
            setSectionProgress(sectionProgress);
          }
        }
      });

      setActiveSection(mostVisibleSection);
    };

    // Observe section elements
    const observer = new MutationObserver(() => {
      SECTION_IDS.forEach((id) => {
        sectionElements[id] = document.getElementById(`section-${id}`);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial lookup
    setTimeout(() => {
      SECTION_IDS.forEach((id) => {
        sectionElements[id] = document.getElementById(`section-${id}`);
      });
      handleScroll();
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [setActiveSection, setScrollProgress, setSectionProgress]);
}
