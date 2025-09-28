'use client';

import { Card, CardBody } from '@progress/kendo-react-layout';
import { folderAddIcon, xIcon } from '@progress/kendo-svg-icons';
import { Link } from 'react-router-dom';
import type { Collection } from '@/api/collections/types';
import { CollectionCard } from './CollectionCard';
import { Skeleton } from '@progress/kendo-react-indicators';
import { Button } from '@progress/kendo-react-buttons';
import { SvgIcon } from '@progress/kendo-react-common';

type CollectionsGridProps = {
  isInitialized: boolean;
  displayedCollections: Collection[];
  cardsToReview: Collection | null;
  showReviewCard: boolean;
  searchQuery: string | null;
  selectedTag: string | null;
  collectionCardProps: Omit<React.ComponentProps<typeof CollectionCard>, 'collection'>;
  onClearFilters: () => void;
  onShowCreateDialog: () => void;
};

function CollectionsSkeleton() {
  return (
    <div className="row">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="col-12 col-md-6 col-lg-3 mb-4">
          <Card>
            <CardBody>
              <Skeleton className="h-6 w-75" />
              <Skeleton className="h-4 w-100 mt-2" />
              <Skeleton className="h-4 w-50 mt-1" />
              <div className="mt-3">
                <Skeleton className="h-10 w-100" />
              </div>
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ searchQuery, selectedTag, onClearFilters, onShowCreateDialog }: Pick<CollectionsGridProps, 'searchQuery' | 'selectedTag' | 'onClearFilters' | 'onShowCreateDialog'>) {
  const hasFilters = searchQuery || selectedTag;
  return (
    <div className="text-center py-4 my-4 rounded-2 border-2 border-secondary rounded-lg" style={{ borderStyle: 'dashed !important' }}>
      <h2 className="fs-4 fw-semibold">{hasFilters ? "No collections match your filters" : "No collections yet"}</h2>
      <p className="text-muted mt-2">
        {hasFilters ? "Try adjusting your search or clearing the filters." : "Create your first collection to get started!"}
      </p>
      <Button className="mt-4" onClick={() => hasFilters ? onClearFilters() : onShowCreateDialog()}>
        {hasFilters ? <><SvgIcon icon={xIcon} className="me-2" /> Clear Filters</> : <><SvgIcon icon={folderAddIcon} className="me-2" /> Create Collection</>}
      </Button>
    </div>
  );
}

export function CollectionsGrid({
  isInitialized,
  displayedCollections,
  cardsToReview,
  showReviewCard,
  searchQuery,
  selectedTag,
  collectionCardProps,
  onClearFilters,
  onShowCreateDialog
}: CollectionsGridProps) {
  if (!isInitialized) {
    return <CollectionsSkeleton />;
  }

  const hasNoCollections = displayedCollections.length === 0;

  if (hasNoCollections && !showReviewCard) {
    return (
      <EmptyState
        searchQuery={searchQuery}
        selectedTag={selectedTag}
        onClearFilters={onClearFilters}
        onShowCreateDialog={onShowCreateDialog}
      />
    );
  }

  return (
    <>
      {!hasNoCollections ? (
        <div className="row">
          {showReviewCard && cardsToReview && (
            <div key={cardsToReview.id} className="col-12 col-md-6 col-lg-3">
              <Card key={cardsToReview.id} className="bg-light border-secondary shadow-sm">
                <CardBody>
                  <div className="d-flex flex-column justify-content-between gap-2" style={{ minHeight: '200px' }}>
                    <div className='w-100'>
                      <h5 className="card-title mb-1">{cardsToReview.name}</h5>
                      <p className="card-text text-muted m-0">{cardsToReview.description || `${cardsToReview.cards.length} card(s)`}</p>
                    </div>

                    <Link to={`/collections/${cardsToReview.id}`} className='w-100 d-flex link-underline link-underline-opacity-0'>
                      <Button className='w-100'>Start Reviewing</Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {displayedCollections.map((collection) => (
            <div key={collection.id} className="col-12 col-md-6 col-lg-3 mb-4">
              <CollectionCard collection={collection} {...collectionCardProps} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          searchQuery={searchQuery}
          selectedTag={selectedTag}
          onClearFilters={onClearFilters}
          onShowCreateDialog={onShowCreateDialog}
        />
      )}
    </>
  );
}