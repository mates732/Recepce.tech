'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';

const COMMANDS = [
  { id: 'skills', label: '/skills', desc: 'View technical skills & expertise' },
  { id: 'projects', label: '/projects', desc: 'Browse featured projects' },
  { id: 'youtube', label: '/youtube', desc: 'Explore YouTube content' },
  { id: 'contact', label: '/contact', desc: 'Get in touch' },
  { id: 'about', label: '/about', desc: 'About Matyáš Vojan' },
  { id: 'help', label: '/help', desc: 'Show available commands' },
];

export default function CommandPalette() {
  const isOpen = useStore((s) => s.isCommandPaletteOpen);
  const setOpen = useStore((s) => s.setCommandPaletteOpen);
  const setActiveSection = useStore((s) => s.setActiveSection);
  const [input, setInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = COMMANDS.filter(
    (cmd) =>
      cmd.label.includes(input.toLowerCase()) ||
      cmd.desc.toLowerCase().includes(input.toLowerCase())
  );

  const executeCommand = useCallback(
    (cmdId: string) => {
      const sectionMap: Record<string, number> = {
        skills: 2,
        projects: 2,
        youtube: 3,
        contact: 4,
        about: 0,
      };

      if (cmdId in sectionMap) {
        const section = sectionMap[cmdId] as 0 | 1 | 2 | 3 | 4;
        setActiveSection(section);
        document.getElementById(`section-${section}`)?.scrollIntoView({
          behavior: 'smooth',
        });
      }

      setOpen(false);
      setInput('');
    },
    [setActiveSection, setOpen]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
        setInput('');
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        setOpen(false);
        setInput('');
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }

      if (e.key === 'Enter' && filtered[selectedIndex]) {
        executeCommand(filtered[selectedIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen, filtered, selectedIndex, executeCommand]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      queueMicrotask(() => setSelectedIndex(0));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0a0a12] shadow-2xl shadow-[#00d4ff]/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <span className="font-mono text-sm text-[#00d4ff]/50">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command..."
            className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/20"
          />
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center font-mono text-xs text-white/30">
              No commands found
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => executeCommand(cmd.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                  i === selectedIndex
                    ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                <span className="font-mono text-sm font-medium">
                  {cmd.label}
                </span>
                <span className="text-xs text-white/40">{cmd.desc}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-white/5 px-4 py-2">
          <span className="font-mono text-[10px] text-white/20">
            ↑↓ Navigate
          </span>
          <span className="font-mono text-[10px] text-white/20">
            ↵ Select
          </span>
          <span className="font-mono text-[10px] text-white/20">
            Esc Close
          </span>
        </div>
      </div>
    </div>
  );
}
