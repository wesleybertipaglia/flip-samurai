'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { StatsGrid } from '@/app/dashboard/_components/StatsGrid';
import { MasteryList } from '@/app/dashboard/_components/MasteryList';

export default function DashboardPage() {
    const { stats, collections, isInitialized, getMasteryLevel } = useDashboard();

    return (
        <div className="d-flex flex-column gap-4">
            <StatsGrid stats={stats} isInitialized={isInitialized} />
            <MasteryList
                collections={collections}
                isInitialized={isInitialized}
                getMasteryLevel={getMasteryLevel}
            />
        </div>
    );
}
