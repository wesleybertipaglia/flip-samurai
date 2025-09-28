'use client';

import type { Progress } from './types';
import { tinid } from '@wesleybertipaglia/tinid';
import { getItem, setItem, initializeItem } from '@/lib/storage';
import type { IProgressService } from './progress.interface';

const PROGRESS_STORAGE_KEY = 'progress';

class ProgressMockService implements IProgressService {
  constructor() {
    initializeItem(PROGRESS_STORAGE_KEY, []);
  }

  private loadProgressFromStorage(): Progress[] {
    return getItem<Progress[]>(PROGRESS_STORAGE_KEY, []);
  }

  private saveProgressToStorage(progress: Progress[]) {
    setItem(PROGRESS_STORAGE_KEY, progress);
  }

  async getProgress(): Promise<Progress[]> {
    const progress = this.loadProgressFromStorage();
    return Promise.resolve(progress);
  }

  async addProgress(entityId: string, entityType: 'collection' | 'card'): Promise<Progress> {
    const newProgress: Progress = {
      id: tinid(),
      entityId,
      entityType,
      interactionType: 'revision',
      date: new Date().toISOString(),
    };
    const currentProgress = this.loadProgressFromStorage();
    const updatedProgress = [...currentProgress, newProgress];
    this.saveProgressToStorage(updatedProgress);
    return Promise.resolve(newProgress);
  }
}

export const progressMockService = new ProgressMockService();
