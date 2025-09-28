'use client';

import { useMemo } from 'react';
import { useCollections } from '@/hooks/use-collections';
import { useProgress } from '@/hooks/use-progress';
import { getMasteryLevel, type ProgressStats } from '@/api/progress/types';
import { isToday } from '@/lib/date-utils';

export function useDashboard() {
    const { collections, isInitialized: collectionsInitialized, cardsToReview } = useCollections();
    const { progress, isInitialized: progressInitialized } = useProgress();

    const isInitialized = collectionsInitialized && progressInitialized;

    const stats: ProgressStats = useMemo(() => {
        const cardRevisionsToday = progress.filter(p =>
            p.entityType === 'card' && p.interactionType === 'revision' && isToday(new Date(p.date))
        );
        const collectionRevisionsToday = progress.filter(p =>
            p.entityType === 'collection' && p.interactionType === 'revision' && isToday(new Date(p.date))
        );

        const totalRevisions = progress.filter(p => p.interactionType === 'revision').length;

        const allCards = collections.flatMap(c => c.cards);

        const avgCardsPerCollection = collections.length > 0
            ? (allCards.length / collections.length).toFixed(1)
            : 0;

        return {
            totalCollections: collections.length,
            totalCards: allCards.length,
            collectionsRevisedToday: collectionRevisionsToday.length,
            cardsRevisedToday: cardRevisionsToday.length,
            cardsToReviewCount: cardsToReview.cards.length,
            avgCards: avgCardsPerCollection,
            totalRevisions: totalRevisions,
        };

    }, [collections, progress, cardsToReview]);

    return {
        stats,
        collections,
        isInitialized,
        getMasteryLevel,
    };
}
