export type Progress = {
    id: string;
    entityId: string;
    entityType: 'collection' | 'card';
    interactionType: 'revision';
    date: string;
};

export type ProgressStats = {
    totalCollections: number;
    totalCards: number;
    collectionsRevisedToday: number;
    cardsRevisedToday: number;
    cardsToReviewCount: number;
    avgCards: string | number;
    totalRevisions: number;
}

export type MasteryLevel = {
    level: string;
    variant: "primary" | "secondary" | "info" | "base" | null | undefined;
    color: string;
}

export const getMasteryLevel = (count: number = 0) => {
    if (count > 10) return { level: 'Mastered', variant: 'primary' as const, color: 'text-light' };
    if (count > 5) return { level: 'Proficient', variant: 'info' as const, color: 'text-light' };
    if (count > 2) return { level: 'Familiar', variant: 'secondary' as const, color: 'text-dark' };
    return { level: 'Novice', variant: 'base' as const, color: 'text-dark' };
}