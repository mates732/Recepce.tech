export type EntityType =
  | 'question'
  | 'observation'
  | 'experiment'
  | 'system'
  | 'project'
  | 'technology'
  | 'article'
  | 'insight'
  | 'failure'
  | 'principle'
  | 'person'
  | 'tool'
  | 'decision'
  | 'pattern';

export type RelationshipType =
  | 'questioned'
  | 'observed'
  | 'experimented'
  | 'became'
  | 'supports'
  | 'contradicts'
  | 'depends_on'
  | 'inspired'
  | 'evolved_into'
  | 'generated'
  | 'uses'
  | 'created';

export type EntityStatus = 'seed' | 'growing' | 'mature' | 'dormant' | 'archived';

export interface Relationship {
  targetId: string;
  type: RelationshipType;
  note?: string;
}

export interface Entity {
  id: string;
  slug: string;
  title: string;
  type: EntityType;
  summary: string;
  body?: string[];
  created: string;
  updated: string;
  status: EntityStatus;
  tags: string[];
  relationships: Relationship[];
  nextQuestion?: string;
}
