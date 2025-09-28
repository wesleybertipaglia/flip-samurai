'use client';

import { Card, CardBody } from '@progress/kendo-react-layout';
import { Checkbox } from '@progress/kendo-react-inputs';
import { Label } from '@progress/kendo-react-labels';
import type { Collection } from '@/api/collections/types';

type ManageFolderCollectionsProps = {
    unassignedCollections: Collection[];
    selectedCollectionIds: string[];
    onCollectionToggle: (collectionId: string, isChecked: boolean) => void;
};

export function ManageFolderCollections({
    unassignedCollections,
    selectedCollectionIds,
    onCollectionToggle,
}: ManageFolderCollectionsProps) {
    return (
        <Card className='shadow-sm'>
            <CardBody className="d-flex flex-column gap-3">
                <div>
                    <p className="fs-5 fw-semibold m-0">Manage Collections</p>
                    <p className="text-muted m-0">Select which collections belong to this folder.</p>
                </div>

                {unassignedCollections.length > 0 ? (
                    <div className="d-flex flex-column gap-2" style={{ maxHeight: '384px', overflowY: 'auto', paddingRight: '1rem' }}>
                        {unassignedCollections.map((collection) => (
                            <div key={collection.id} className="d-flex align-items-center gap-3 border rounded p-3">
                                <Checkbox
                                    id={`collection-${collection.id}`}
                                    checked={selectedCollectionIds.includes(collection.id)}
                                    onChange={(e) => onCollectionToggle(collection.id, e.value)}
                                />
                                <Label id={`collection-${collection.id}`} className="fw-medium">
                                    {collection.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted text-center">No available collections to add.</p>
                )}
            </CardBody>
        </Card>
    );
}