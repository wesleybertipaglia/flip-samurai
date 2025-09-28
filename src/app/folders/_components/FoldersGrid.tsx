'use client';

import { Card, CardBody } from '@progress/kendo-react-layout';
import { Skeleton } from '@progress/kendo-react-indicators';
import { Button } from '@progress/kendo-react-buttons';
import { plusIcon, xIcon } from '@progress/kendo-svg-icons';
import { FolderCard } from './FolderCard';
import type { Folder } from '@/api/folders/types';
import { SvgIcon } from '@progress/kendo-react-common';

type FoldersGridProps = {
    isInitialized: boolean;
    filteredFolders: Folder[];
    searchQuery: string | null;
    selectedTag: string | null;
    onClearFilters: () => void;
    onCreateFolder: () => void;
    onEdit: (id: string) => void;
    onDelete: (folder: Folder) => void;
    onSelectTag: (tag: string) => void;
};

function FoldersSkeleton() {
    return (
        <div className="row g-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-3">
                    <Card className='shadow-sm'>
                        <CardBody>
                            <div>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2 mt-2" />
                            </div>
                            <div>
                                <Skeleton className="h-10 w-100" />
                            </div>
                        </CardBody>
                    </Card>
                </div>
            ))}
        </div>
    );
}

function EmptyState({
    searchQuery,
    selectedTag,
    onClearFilters,
    onCreateFolder,
}: Pick<FoldersGridProps, 'searchQuery' | 'selectedTag' | 'onClearFilters' | 'onCreateFolder'>) {
    const hasFilters = searchQuery || selectedTag;
    return (
        <div className="text-center py-4 my-4 rounded-2 border-2 border-secondary rounded-lg" style={{ borderStyle: 'dashed !important' }}>
            <h2 className="fs-4 font-semibold">{hasFilters ? 'No folders match your filters' : 'No folders yet'}</h2>
            <p className="text-muted-foreground mt-2">
                {hasFilters
                    ? 'Try adjusting your search or clearing the filters.'
                    : 'Create your first folder to organize your collections.'}
            </p>
            <Button className="mt-4" onClick={() => (hasFilters ? onClearFilters() : onCreateFolder())}>
                {hasFilters ? (
                    <>
                        <SvgIcon icon={xIcon} /> Clear Filters
                    </>
                ) : (
                    <>
                        <SvgIcon icon={plusIcon} /> Create Folder
                    </>
                )}
            </Button>
        </div>
    );
}

export function FoldersGrid({
    isInitialized,
    filteredFolders,
    searchQuery,
    selectedTag,
    onClearFilters,
    onCreateFolder,
    onEdit,
    onDelete,
    onSelectTag,
}: FoldersGridProps) {
    if (!isInitialized) {
        return <FoldersSkeleton />;
    }

    if (filteredFolders.length === 0) {
        return (
            <EmptyState
                searchQuery={searchQuery}
                selectedTag={selectedTag}
                onClearFilters={onClearFilters}
                onCreateFolder={onCreateFolder}
            />
        );
    }

    return (
        <div className="row">
            {filteredFolders.map((folder) => {
                const collectionsCount = folder.collectionIds.length;
                return (
                    <div key={folder.id} className="col-12 col-md-6 col-lg-3 mb-4">
                        <FolderCard
                            key={folder.id}
                            folder={folder}
                            collectionsCount={collectionsCount}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onSelectTag={onSelectTag}
                        />
                    </div>
                );
            })}
        </div>
    );
}