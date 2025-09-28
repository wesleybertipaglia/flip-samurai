'use client';

import type { ProgressStats } from '@/api/progress/types';
import { StatCard } from './StatCard';

export function StatsGrid({ stats, isInitialized }: { stats: ProgressStats, isInitialized: boolean }) {
    return (
        <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                <div className="col">
                    <StatCard title="Total Collections" value={stats.totalCollections} isLoading={!isInitialized} />
                </div>
                <div className="col">
                    <StatCard title="Total Cards" value={stats.totalCards} isLoading={!isInitialized} />
                </div>
                <div className="col">
                    <StatCard title="Cards to Review" value={stats.cardsToReviewCount} isLoading={!isInitialized} description="Cards not reviewed in the last 7 days." />
                </div>
                <div className="col">
                    <StatCard title="Avg. Cards/Collection" value={stats.avgCards} isLoading={!isInitialized} />
                </div>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
                <div className="col">
                    <StatCard title="Collections Revised Today" value={stats.collectionsRevisedToday} isLoading={!isInitialized} />
                </div>
                <div className="col">
                    <StatCard title="Cards Revised Today" value={stats.cardsRevisedToday} isLoading={!isInitialized} />
                </div>
                <div className="col">
                    <StatCard title="Total Study Sessions" value={stats.totalRevisions} isLoading={!isInitialized} description="Total number of cards reviewed across all time." />
                </div>
            </div>
        </>
    );
}
