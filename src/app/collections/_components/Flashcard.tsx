'use client';

import { useState } from 'react';
import { Card } from '@progress/kendo-react-layout';
import { useNavigate } from 'react-router-dom';

type FlashcardProps = {
  front: React.ReactNode;
  back: React.ReactNode;
  link?: string;
};

export function Flashcard({ front, back, link }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleCardFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleCardClick = () => {
    if (link) {
      navigate(link);
    }
    handleCardFlip();
  };

  return (
    <div
      className="w-100 cursor-pointer mb-4 overflow-hidden"
      style={{ perspective: '1000px', height: '300px' }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          handleCardClick();
        }
      }}
      aria-label="Flashcard, click to flip"
      aria-pressed={isFlipped}
    >
      <div
        className={`position-relative h-100 w-100 transition duration-500`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : '',
          transition: 'transform 0.6s',
        }}>
        {/* front */}
        <div
          className="position-absolute h-100 w-100"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Card className="h-100 w-100 shadow-sm p-4 bg-white rounded">
            <div className="d-flex h-100 align-items-center justify-content-center p-4 fs-3 fw-semibold text-center">
              {front}
            </div>
          </Card>
        </div>

        {/* back */}
        <div
          className="position-absolute h-100 w-100"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <Card className="h-100 w-100 p-4 bg-white rounded">
            <div className="d-flex h-100 align-items-center justify-content-center fs-4 text-center">
              {back}
            </div>
          </Card>
        </div>
      </div>
    </div >
  );
}