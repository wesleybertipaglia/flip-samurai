import type { Progress } from './types';

export interface IProgressService {
  getProgress(): Promise<Progress[]>;
  addProgress(entityId: string, entityType: 'collection' | 'card'): Promise<Progress>;
}
