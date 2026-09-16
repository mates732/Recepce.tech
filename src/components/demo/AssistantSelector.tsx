'use client';

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import type { AssistantDemo } from '@/data/assistants';

interface AssistantSelectorProps {
  assistants: AssistantDemo[];
  value: AssistantDemo;
  onChange: (a: AssistantDemo) => void;
}

export default function AssistantSelector({
  assistants,
  value,
  onChange,
}: AssistantSelectorProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const selectedIndex = assistants.findIndex((a) => a.id === value.id);

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  const selectOption = useCallback(
    (assistant: AssistantDemo) => {
      onChange(assistant);
      closeDropdown();
    },
    [onChange, closeDropdown],
  );

  const openDropdown = useCallback(() => {
    setOpen(true);
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const insidePanel = panelRef.current?.contains(target) ?? false;
      const insideTrigger = triggerRef.current?.contains(target) ?? false;
      if (!insidePanel && !insideTrigger) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open, closeDropdown]);

  useLayoutEffect(() => {
    if (!open) return;
    optionRefs.current[focusedIndex]?.focus();
  }, [open, focusedIndex]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown();
      }
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < assistants.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : assistants.length - 1,
        );
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIndex >= 0) {
          selectOption(assistants[focusedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeDropdown();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setFocusedIndex((prev) =>
          e.shiftKey
            ? prev <= 0
              ? assistants.length - 1
              : prev - 1
            : prev >= assistants.length - 1
              ? 0
              : prev + 1,
        );
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, focusedIndex, assistants, selectOption, closeDropdown]);

  return (
    <div className="relative inline-block w-full sm:max-w-sm">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Vyberte asistenta"
        onClick={() => (open ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink transition-colors duration-200 hover:border-border-strong hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        <span className="flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface-muted">
            <Icon name={value.icon} className="h-4 w-4" />
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-semibold text-ink">{value.name}</span>
            <span className="text-muted">·</span>
            <span className="text-muted">{value.category}</span>
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="listbox"
            aria-label="Výběr asistenta"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute z-50 mt-2 w-full min-w-[260px] rounded-xl border border-border bg-surface shadow-[0_16px_48px_-24px_rgba(23,23,22,0.16)] overflow-hidden"
          >
            <div className="max-h-[70vh] overflow-y-auto p-1">
              {assistants.map((assistant, index) => {
                const selected = assistant.id === value.id;
                return (
                  <div
                    key={assistant.id}
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    onClick={() => selectOption(assistant)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 cursor-pointer ${
                      selected
                        ? 'bg-accent-soft'
                        : 'hover:bg-surface-muted'
                    }`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-surface-muted">
                      <Icon name={assistant.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">
                        {assistant.name}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {assistant.category}
                      </p>
                    </div>
                    {selected && (
                      <Icon
                        name="check"
                        className="h-4 w-4 shrink-0 text-ink"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
