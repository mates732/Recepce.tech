'use client';

import { Icon } from '@/components/shared/Icon';
import type { IconName } from '@/components/shared/Icon';

export interface TabDef {
  id: string;
  label: string;
  icon: IconName;
}

export default function TabsNav({
  tabs,
  active,
  onChange,
}: {
  tabs: TabDef[];
  active: string;
  onChange: (id: string) => string | void;
}) {
  return (
    <nav className="overflow-x-auto border-b border-border" aria-label="Záložky">
      <ul className="flex min-w-max gap-1 px-2" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <li key={tab.id} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-b-2 border-accent text-ink'
                    : 'border-b-2 border-transparent text-muted hover:text-ink'
                }`}
              >
                <Icon name={tab.icon} className="h-4 w-4" />
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
