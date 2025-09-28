'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Progress } from '@/api/progress/types';
import { getProgressService } from '@/lib/services';

const progressService = getProgressService();

export function useProgress() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadProgress = useCallback(async () => {
    try {
      const loadedProgress = await progressService.getProgress();
      setProgress(loadedProgress);
    } catch (error) {
      console.error("Failed to load progress", error);
      setProgress([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);
  
  const addProgress = useCallback(async (entityId: string, entityType: 'collection' | 'card') => {
      await progressService.addProgress(entityId, entityType);
      await loadProgress();
  }, [loadProgress]);

  const revisionCounts = useMemo(() => {
    const counts = new Map<string, { count: number, lastRevised: string }>();
    progress.forEach(p => {
        if (p.interactionType === 'revision') {
            const existing = counts.get(p.entityId) || { count: 0, lastRevised: '' };
            counts.set(p.entityId, {
                count: existing.count + 1,
                lastRevised: p.date > existing.lastRevised ? p.date : existing.lastRevised
            });
        }
    });
    return counts;
  }, [progress]);

  const getRevisionCount = useCallback((entityId: string) => revisionCounts.get(entityId)?.count || 0, [revisionCounts]);
  const getLastRevisedDate = useCallback((entityId: string) => revisionCounts.get(entityId)?.lastRevised, [revisionCounts]);


  return {
    progress,
    isInitialized,
    addProgress,
    revisionCounts,
    getRevisionCount,
    getLastRevisedDate,
  };
}
