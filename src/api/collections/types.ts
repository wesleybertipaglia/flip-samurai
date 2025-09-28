export type Flashcard = {
  id: string;
  front: string;
  back: string;
  collectionId?: string;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  tags?: string[];
  source?: 'created' | 'imported' | 'ai-generated';
  folderId?: string;
  isFavorite?: boolean;
};
