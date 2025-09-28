'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCollections } from '@/hooks/use-collections';
import { Button } from '@progress/kendo-react-buttons';
import { Flashcard } from '@/app/collections/_components/Flashcard';
import { arrowLeftIcon, arrowRightIcon, checkCircleIcon } from '@progress/kendo-svg-icons'
import { SvgIcon } from '@progress/kendo-react-common';
import { ProgressBar } from '@progress/kendo-react-progressbars';
import { Skeleton } from '@progress/kendo-react-indicators';

export default function CollectionContentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCollectionById, isInitialized, finishStudySession } = useCollections();
  const [currentIndex, setCurrentIndex] = useState(0);

  const collection = useMemo(() => {
    if (id === undefined) {
      return undefined;
    }
    return getCollectionById(id);
  }, [id, getCollectionById]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [id]);

  if (!isInitialized) {
    return (
      <div className="d-flex flex-column align-items-center">
        <Skeleton className="h-96 w-100 max-w-2xl mb-4" />
        <Skeleton className="h-4 w-100 max-w-2xl mb-4" />
        <div className="d-flex justify-content-between w-100 max-w-2xl">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="py-16 text-center">
        <h2 className="fs-3 font-bold">Collection not found</h2>
        <p className="text-muted-foreground mt-2">The collection you are looking for does not exist.</p>
        <Button className="mt-4" themeColor={"base"} onClick={() => navigate('/collections')}>
          <SvgIcon icon={arrowLeftIcon} className="mr-2" /> Back to Collections
        </Button>
      </div>
    );
  }

  const { cards } = collection;
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  const currentCard = cards[currentIndex];

  const goToNext = () => setCurrentIndex(prev => Math.min(prev + 1, cards.length - 1));
  const goToPrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  const handleFinish = async () => {
    if (collection) {
      await finishStudySession(collection);
      navigate('/collections');
    }
  }

  const isLastCard = currentIndex === cards.length - 1;

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="w-100 max-w-2xl mb-4">
        <Button themeColor={"base"} size="small" onClick={() => navigate('/collections')}>
          <SvgIcon icon={arrowLeftIcon} className="mr-2" /> Back to Collections
        </Button>
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-2">{collection.name}</h1>
      <p className="text-muted-foreground mb-6">Card {cards.length > 0 ? currentIndex + 1 : 0} of {cards.length}</p>

      {cards.length > 0 ? (
        <>
          <Flashcard key={currentCard.id} front={currentCard.front} back={currentCard.back} />

          <div className="w-100 max-w-2xl mt-6">
            <ProgressBar value={progress} />
            <div className="d-flex justify-content-between w-100 mt-4">
              <Button onClick={goToPrev} disabled={currentIndex === 0} themeColor={"base"}>
                <SvgIcon icon={arrowLeftIcon} className="mr-2" /> Previous
              </Button>
              {isLastCard ? (
                <Button onClick={handleFinish}>
                  Finish <SvgIcon icon={checkCircleIcon} className="mr-2" />
                </Button>
              ) : (
                <Button onClick={goToNext}>
                  Next <SvgIcon icon={arrowRightIcon} className="mr-2" />
                </Button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4 my-4 rounded-2 border-2 border-secondary rounded-lg" style={{ borderStyle: 'dashed !important' }}>
          <h2 className="fs-4 font-semibold">This collection is empty</h2>
          <p className="text-muted-foreground mt-2">Add some cards to start studying.</p>
          <Button className="mt-4" themeColor={"base"} onClick={() => navigate(`/collections/${collection.id}/edit`)}>
            Edit Collection
          </Button>
        </div>
      )}
    </div>
  );
}
