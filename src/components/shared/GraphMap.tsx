'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllEntities, getEntityById, ENTITY_TYPE_LABELS } from '@/lib/graph';
import type { Entity, EntityType } from '@/types/graph';
import Reveal from './Reveal';
import { easeOut } from '@/lib/animations';

const FOCUS_TYPES: EntityType[] = ['question', 'observation', 'experiment', 'system'];

function EntityNode({ entity }: { entity: Entity }) {
  const [open, setOpen] = useState(false);
  const isFocus = FOCUS_TYPES.includes(entity.type);

  return (
    <div className="border-l border-black/[0.08] pl-4">
      <button
        onClick={() => setOpen(!open)}
        className="group text-left w-full"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-light text-black/[0.4] transition-transform duration-300 group-hover:translate-x-1">
            {open ? '▾' : '▸'}
          </span>
          <p className={`font-light text-black transition-colors duration-300 group-hover:text-black ${isFocus ? 'text-sm' : 'text-xs text-black/[0.6]'}`}>
            {entity.title}
          </p>
          <span className="text-[10px] font-light text-black/[0.3] uppercase tracking-wider">
            {entity.type}
          </span>
        </div>
        {isFocus && (
          <p className="mt-0.5 text-xs font-light text-black/[0.5] line-clamp-1 pl-5">
            {entity.summary}
          </p>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="pl-5 pt-3 pb-4 space-y-2.5">
              {entity.body && entity.body.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {entity.body.map((line, i) => (
                    <p key={i} className="text-xs font-light text-black/[0.6] leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {entity.relationships.length > 0 && (
                <>
                  <p className="text-[10px] font-light uppercase tracking-wider text-black/[0.3]">
                    {entity.relationships.length} connection{entity.relationships.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1.5">
                    {entity.relationships.map((rel) => {
                      const target = getEntityById(rel.targetId);
                      const slug = target?.slug ?? rel.targetId;
                      return (
                        <Link
                          key={rel.targetId}
                          href={`/${slug}`}
                          className="block text-xs font-light text-black/[0.5] hover:text-black transition-colors duration-300"
                        >
                          {rel.type}
                          <span className="text-black/[0.15] mx-1.5">→</span>
                          {target?.title ?? rel.targetId}
                          {rel.note && (
                            <span className="text-black/[0.3]"> — {rel.note}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}

              {entity.relationships.length === 0 && (
                <p className="text-[10px] font-light text-black/[0.3]">
                  No connections yet
                </p>
              )}

              <Link
                href={`/${entity.slug}`}
                className="inline-block mt-2 text-[10px] font-light uppercase tracking-wider text-black hover:text-black transition-colors duration-300"
              >
                View full page →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GraphMap() {
  const groups = useMemo(() => {
    const all = getAllEntities();
    const typeOrder: EntityType[] = ['question', 'observation', 'experiment', 'system', 'technology', 'principle'];
    const map = new Map<EntityType, Entity[]>();

    for (const type of typeOrder) {
      const items = all.filter((e) => e.type === type);
      if (items.length > 0) map.set(type, items);
    }

    return Array.from(map.entries());
  }, []);

  return (
    <div className="space-y-10">
      {groups.map(([type, entities]) => (
        <div key={type}>
          <p className="text-xs font-light uppercase tracking-widest text-black mb-4">
            {ENTITY_TYPE_LABELS[type] || type}
          </p>
          <div className="space-y-3">
            {entities.map((entity, i) => (
              <Reveal key={entity.id} delay={i * 100}>
                <EntityNode entity={entity} />
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}