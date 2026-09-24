'use client';

import { useState } from 'react';
import TabsNav from '@/components/admin/TabsNav';
import type { TabDef } from '@/components/admin/TabsNav';
import type { Assistant, ClientOps, KnowledgeEntry } from '@/data/ops';
import OverviewTab from './tabs/OverviewTab';
import PromptTab from './tabs/PromptTab';
import KnowledgeTab from './tabs/KnowledgeTab';
import VoiceTab from './tabs/VoiceTab';
import BehaviorTab from './tabs/BehaviorTab';
import IntegrationsTab from './tabs/IntegrationsTab';
import AnalyticsTab from './tabs/AnalyticsTab';

const TABS: TabDef[] = [
  { id: 'overview', label: 'Přehled', icon: 'grid' },
  { id: 'prompt', label: 'Prompt', icon: 'code' },
  { id: 'knowledge', label: 'Znalosti', icon: 'book-open' },
  { id: 'voice', label: 'Hlas', icon: 'volume-2' },
  { id: 'behavior', label: 'Chování', icon: 'sliders' },
  { id: 'integrations', label: 'Integrace', icon: 'link' },
  { id: 'analytics', label: 'Analytika', icon: 'bar-chart' },
];

export default function AssistantDetailTabs({
  assistant,
  client,
  knowledge,
}: {
  assistant: Assistant;
  client?: ClientOps;
  knowledge: KnowledgeEntry[];
}) {
  const [active, setActive] = useState('overview');

  return (
    <div className="rounded-xl border border-border bg-surface">
      <TabsNav tabs={TABS} active={active} onChange={setActive} />
      <div className="p-5 lg:p-6">
        {active === 'overview' && <OverviewTab assistant={assistant} client={client} />}
        {active === 'prompt' && <PromptTab assistant={assistant} />}
        {active === 'knowledge' && <KnowledgeTab knowledge={knowledge} />}
        {active === 'voice' && <VoiceTab assistant={assistant} />}
        {active === 'behavior' && <BehaviorTab assistant={assistant} />}
        {active === 'integrations' && <IntegrationsTab assistant={assistant} />}
        {active === 'analytics' && <AnalyticsTab assistant={assistant} />}
      </div>
    </div>
  );
}
