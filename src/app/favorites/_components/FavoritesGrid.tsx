'use client';

import { Card, CardBody } from '@progress/kendo-react-layout';
import { Skeleton } from '@progress/kendo-react-indicators';
import { Button } from '@progress/kendo-react-buttons';
import { Link } from 'react-router-dom';
import type { Collection } from '@/api/collections/types';
import { CollectionCard } from '@/app/collections/_components/CollectionCard';

type FavoritesGridProps = {
    isInitialized: boolean;
    favoriteCollections: Collection[];
    collectionCardProps: Omit<React.ComponentProps<typeof CollectionCard>, 'collection'>;
    searchQuery: string | null;
    selectedTag: string | null;
};

function FavoritesSkeleton() {
    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="col">
                    <Card className='shadow-sm'>
                        <CardBody>
                            <div>
                                <Skeleton className="h-6 w-3/4" />
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

function EmptyState({ searchQuery, selectedTag }: { searchQuery: string | null, selectedTag: string | null }) {
    return (
        <div className="text-center py-4 my-4 rounded-2 border-2 border-secondary rounded-lg" style={{ borderStyle: 'dashed !important' }}>
            <h2 className="h4 font-weight-bold">
                {searchQuery || selectedTag ? "No favorites match your filters" : "No favorite collections yet"}
            </h2>
            <p className="text-muted mt-2">
                {searchQuery || selectedTag ? "Try adjusting your search." : "Click the star on a collection to add it to your favorites."}
            </p>
            <Link className="mt-4" to={"/collections"}>
                <Button>
                    View All Collections
                </Button>
            </Link>
        </div>
    );
}

export function FavoritesGrid({ isInitialized, favoriteCollections, collectionCardProps, searchQuery, selectedTag }: FavoritesGridProps) {
    if (!isInitialized) {
        return <FavoritesSkeleton />;
    }

    if (favoriteCollections.length === 0) {
        return <EmptyState searchQuery={searchQuery} selectedTag={selectedTag} />;
    }

    return (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {favoriteCollections.map(collection => (
                <div key={collection.id} className="col">
                    <CollectionCard collection={collection} {...collectionCardProps} />
                </div>
            ))}
        </div>
    );
}
