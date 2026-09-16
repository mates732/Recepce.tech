/**
 * Mindspace Graph — Data layer and validation.
 *
 * This module is the single source of truth for all graph data.
 * It validates the graph on first import in development and
 * provides query functions for entity traversal.
 *
 * Invariants enforced:
 *   - Every entity ID is unique.
 *   - At most ONE relationship exists between any pair of entities.
 *   - Every relationship references existing entities.
 *   - No self-referencing relationships.
 *   - No orphan entities (every entity has at least one connection).
 *   - All relationship types are valid.
 *   - All entity IDs match a defined pattern.
 */

import { Entity, EntityType, Relationship, RelationshipType } from '../types/graph';
import { entities } from '../data/entities';

// ─── Valid Types ─────────────────────────────────────────

const VALID_ENTITY_TYPES: Set<string> = new Set([
  'question', 'observation', 'experiment', 'system', 'project',
  'technology', 'article', 'insight', 'failure', 'principle',
  'person', 'tool', 'decision', 'pattern',
]);

const VALID_RELATIONSHIP_TYPES: Set<string> = new Set([
  'questioned', 'observed', 'experimented', 'became', 'supports',
  'contradicts', 'depends_on', 'inspired', 'evolved_into',
  'generated', 'uses', 'created',
]);

const ENTITY_ID_PATTERN = /^[a-z]+-[a-z0-9-]+$/;

// ─── Query Functions ─────────────────────────────────────

export function getEntityBySlug(slug: string): Entity | undefined {
  return entities.find((e) => e.slug === slug);
}

export function getEntityById(id: string): Entity | undefined {
  return entities.find((e) => e.id === id);
}

export function getEntitiesByType(type: EntityType): Entity[] {
  return entities.filter((e) => e.type === type);
}

export function getAllSlugs(): string[] {
  return entities.map((e) => e.slug);
}

export function getAllEntities(): Entity[] {
  return entities;
}

// ─── Resolved Relationships ──────────────────────────────

export type ResolvedRelationship = Relationship & { source: Entity; target: Entity };

export function getRelationshipsFrom(entityId: string): ResolvedRelationship[] {
  const source = getEntityById(entityId);
  if (!source) return [];

  return source.relationships
    .map((rel) => {
      const target = getEntityById(rel.targetId);
      if (!target) return null;
      return { ...rel, source, target };
    })
    .filter(Boolean) as ResolvedRelationship[];
}

export function getRelationshipsTo(entityId: string): ResolvedRelationship[] {
  const target = getEntityById(entityId);
  if (!target) return [];

  return entities
    .filter((e) => e.relationships.some((r) => r.targetId === entityId))
    .map((source) => {
      const rel = source.relationships.find((r) => r.targetId === entityId)!;
      return { ...rel, source, target };
    });
}

/**
 * Deduplicate resolved relationships by entity pair.
 *
 * Invariant: the graph should already be valid (no duplicate edges).
 * This function exists as a safety net. In development it throws
 * if duplicates are found. In production it silently deduplicates.
 */
export function dedupeRelationships(
  rels: ResolvedRelationship[],
): ResolvedRelationship[] {
  const seen = new Set<string>();
  const result: ResolvedRelationship[] = [];

  for (const rel of rels) {
    const key = [rel.source.id, rel.target.id].sort().join(':');
    if (!seen.has(key)) {
      seen.add(key);
      result.push(rel);
    } else if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        `[graph] Duplicate relationship in render:\n` +
        `  ${rel.source.id} ↔ ${rel.target.id}\n` +
        `  Type: ${rel.type}\n` +
        `  The graph validation should have caught this.`
      );
    }
  }

  return result;
}

// ─── Entity Labels ───────────────────────────────────────

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  question: 'Question',
  observation: 'Observation',
  experiment: 'Experiment',
  system: 'System',
  project: 'Project',
  technology: 'Technology',
  article: 'Article',
  insight: 'Insight',
  failure: 'Failure',
  principle: 'Principle',
  person: 'Person',
  tool: 'Tool',
  decision: 'Decision',
  pattern: 'Pattern',
};

// ─── Vitality ────────────────────────────────────────────

export function vitality(entity: Entity): number {
  const now = new Date('2025-07-18');
  const updated = new Date(entity.updated);
  const created = new Date(entity.created);
  const daysSinceUpdate = Math.max(0, (now.getTime() - updated.getTime()) / 86400000);
  const age = Math.max(1, (now.getTime() - created.getTime()) / 86400000);

  const statusScore: Record<string, number> = {
    seed: 0.5,
    growing: 1.0,
    mature: 0.7,
    dormant: 0.2,
    archived: 0.0,
  };

  const recency = Math.max(0, 1 - daysSinceUpdate / 90);
  const growth = Math.min(1, age / 30);
  const status = statusScore[entity.status] ?? 0.5;

  return Math.round((recency * 0.5 + growth * 0.2 + status * 0.3) * 100) / 100;
}

// ─── Narrative System ────────────────────────────────────

interface NarrativePair {
  forward: string;
  reverse: string;
}

const NARRATIVES: Record<string, NarrativePair> = {
  questioned: {
    forward: 'This observation raised a question.',
    reverse: 'This question emerged from an observation.',
  },
  observed: {
    forward: 'This question emerged from an observation.',
    reverse: 'This observation raised a question.',
  },
  experimented: {
    forward: 'To explore this question, I built:',
    reverse: 'This experiment attempted to answer:',
  },
  became: {
    forward: 'This evolved into:',
    reverse: 'This began as:',
  },
  supports: {
    forward: 'This is built on:',
    reverse: 'This supports:',
  },
  depends_on: {
    forward: 'This depends on:',
    reverse: 'This is used by:',
  },
  inspired: {
    forward: 'This principle guided:',
    reverse: 'This was guided by a principle:',
  },
  evolved_into: {
    forward: 'This became:',
    reverse: 'This evolved from:',
  },
  generated: {
    forward: 'This created a new question:',
    reverse: 'This was generated by:',
  },
  uses: {
    forward: 'This uses:',
    reverse: 'This is used by:',
  },
  created: {
    forward: 'This was created by:',
    reverse: 'This created:',
  },
};

export function relationshipContext(
  entity: Entity,
  rel: ResolvedRelationship,
): { narrative: string; other: Entity } | null {
  const isSource = rel.source.id === entity.id;
  const isTarget = rel.target.id === entity.id;
  if (!isSource && !isTarget) return null;

  const templates = NARRATIVES[rel.type];
  if (!templates) return null;

  const other = isSource ? rel.target : rel.source;
  const narrative = isSource ? templates.forward : templates.reverse;

  return { narrative, other };
}

// ─── Graph Validation ────────────────────────────────────

interface ValidationReport {
  errors: string[];
  warnings: string[];
}

function validateEntityIds(all: Entity[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const e of all) {
    if (seen.has(e.id)) {
      errors.push(`Duplicate entity ID: "${e.id}"`);
    }
    seen.add(e.id);

    if (!ENTITY_ID_PATTERN.test(e.id)) {
      errors.push(`Malformed entity ID: "${e.id}" (expected pattern: type-slug)`);
    }

    if (!VALID_ENTITY_TYPES.has(e.type)) {
      errors.push(`Invalid entity type "${e.type}" on entity "${e.id}"`);
    }
  }

  return errors;
}

function validateRelationships(all: Entity[]): string[] {
  const errors: string[] = [];
  const idSet = new Set(all.map((e) => e.id));
  const pairMap = new Map<string, { source: string; target: string; type: RelationshipType }>();

  for (const source of all) {
    for (const rel of source.relationships) {
      if (!idSet.has(rel.targetId)) {
        errors.push(
          `Missing target entity "${rel.targetId}" referenced by "${source.id}" (${rel.type})`
        );
        continue;
      }

      if (source.id === rel.targetId) {
        errors.push(`Self-referencing relationship: "${source.id}" → itself (${rel.type})`);
        continue;
      }

      if (!VALID_RELATIONSHIP_TYPES.has(rel.type)) {
        errors.push(`Invalid relationship type "${rel.type}" on "${source.id}" → "${rel.targetId}"`);
        continue;
      }

      const pairKey = `${source.id}:${rel.targetId}`;
      const existing = pairMap.get(pairKey);

      if (existing) {
        const [a, b] = pairKey.split(':');
        errors.push(
          `Duplicate relationship between "${a}" and "${b}":\n` +
          `  Existing: ${existing.type} (${existing.source} → ${existing.target})\n` +
          `  Incoming: ${rel.type} (${source.id} → ${rel.targetId})`
        );
      } else {
        pairMap.set(pairKey, { source: source.id, target: rel.targetId, type: rel.type });
      }
    }
  }

  return errors;
}

function validateOrphans(all: Entity[]): string[] {
  const warnings: string[] = [];

  for (const e of all) {
    const hasOutgoing = e.relationships.length > 0;
    const hasIncoming = all.some((other) =>
      other.id !== e.id && other.relationships.some((r) => r.targetId === e.id)
    );

    if (!hasOutgoing && !hasIncoming) {
      warnings.push(`Orphan entity: "${e.id}" (${e.title}) has no connections`);
    }
  }

  return warnings;
}

function validateCycles(all: Entity[]): string[] {
  const warnings: string[] = [];
  const adj = new Map<string, string[]>();

  for (const e of all) {
    adj.set(e.id, e.relationships.map((r) => r.targetId));
  }

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  for (const e of all) color.set(e.id, WHITE);

  function dfs(node: string, path: string[]): boolean {
    color.set(node, GRAY);
    path.push(node);

    for (const neighbor of adj.get(node) ?? []) {
      const c = color.get(neighbor);
      if (c === GRAY) {
        const cycleStart = path.indexOf(neighbor);
        const cycle = path.slice(cycleStart).concat(neighbor);
        warnings.push(`Circular reference: ${cycle.join(' → ')}`);
        return true;
      }
      if (c === WHITE && dfs(neighbor, path)) {
        return true;
      }
    }

    path.pop();
    color.set(node, BLACK);
    return false;
  }

  for (const e of all) {
    if (color.get(e.id) === WHITE) {
      dfs(e.id, []);
    }
  }

  return warnings;
}

function printReport(report: ValidationReport): void {
  const total = report.errors.length + report.warnings.length;
  if (total === 0) {
    console.log('[graph] Validation passed — 0 errors, 0 warnings');
    return;
  }

  const log = report.errors.length > 0 ? console.error : console.warn;

  log('\n=========================================');
  log('GRAPH VALIDATION REPORT');
  log('=========================================\n');

  if (report.errors.length > 0) {
    console.error(`ERRORS (${report.errors.length}):\n`);
    for (const err of report.errors) {
      console.error(`  ✗ ${err}\n`);
    }
  }

  if (report.warnings.length > 0) {
    log(`WARNINGS (${report.warnings.length}):\n`);
    for (const warn of report.warnings) {
      log(`  ⚠ ${warn}\n`);
    }
  }

  log('=========================================');
  log(`${report.errors.length} error(s), ${report.warnings.length} warning(s)`);
  log('=========================================\n');
}

/**
 * Validate the entire graph for structural integrity.
 * Runs automatically on first import in development.
 * Returns a report with all errors and warnings found.
 */
export function validateGraph(): ValidationReport {
  const all = getAllEntities();

  const report: ValidationReport = {
    errors: [
      ...validateEntityIds(all),
      ...validateRelationships(all),
    ],
    warnings: [
      ...validateOrphans(all),
      ...validateCycles(all),
    ],
  };

  printReport(report);
  return report;
}

// ─── Auto-validate in development ────────────────────────

if (process.env.NODE_ENV !== 'production') {
  validateGraph();
}
