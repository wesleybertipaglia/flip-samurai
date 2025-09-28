'use client';

import { Card, CardBody } from '@progress/kendo-react-layout';
import { useProgress } from '@/hooks/use-progress';
import type { Collection } from '@/api/collections/types';
import type { MasteryLevel } from '@/api/progress/types';

export function MasteryList({ collections, isInitialized, getMasteryLevel }: {
    collections: Collection[],
    isInitialized: boolean,
    getMasteryLevel: (count?: number) => MasteryLevel
}) {
    const { getRevisionCount } = useProgress();

    return (
        <Card className="mb-4 shadow-sm">
            <CardBody>
                <div>
                    <p>Collection Mastery</p>
                    <p>Mastery level is based on how many times you've revised a collection.</p>
                </div>

                {!isInitialized ? (
                    <div className="space-y-4">
                        <div className="skeleton h-8 w-100" />
                        <div className="skeleton h-8 w-100" />
                        <div className="skeleton h-8 w-100" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {collections.length > 0 ? collections.map(collection => {
                            const revisionCount = getRevisionCount(collection.id);
                            const mastery = getMasteryLevel(revisionCount);
                            return (
                                <div key={collection.id} className="d-flex justify-content-between p-2 rounded-lg hover:bg-light">
                                    <p className="font-weight-bold">{collection.name}</p>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-muted">{revisionCount || 0} revisions</span>
                                        <p className={`px-2 fs-6 m-0 border rounded-pill bg-${mastery.variant ?? 'base'} ${mastery.color}`}>
                                            {mastery.level}
                                        </p>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p className="text-muted text-center">No collections yet. Create one to see your mastery progress!</p>
                        )}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
