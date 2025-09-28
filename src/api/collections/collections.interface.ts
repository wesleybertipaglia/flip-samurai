import type { Collection, Flashcard } from './types';

export interface ICollectionsService {
  getCollections(): Promise<Collection[]>;
  getCollectionById(id: string): Promise<Collection | undefined>;
  addCollection(data: {
    name: string;
    description?: string;
    tags?: string[];
    cards?: Flashcard[];
    source?: 'created' | 'imported' | 'ai-generated';
    isFavorite?: boolean;
  }): Promise<Collection>;
  updateCollection(collection: Collection): Promise<Collection>;
  deleteCollection(id: string): Promise<void>;
  addCardToCollection(collectionId: string, card: Omit<Flashcard, 'id'>): Promise<Flashcard>;
  deleteCardFromCollection(collectionId: string, cardId: string): Promise<void>;
  importCollections(collectionsToImport: Collection[]): Promise<void>;
  exportCollectionById(collectionId: string): Promise<void>;
  addCollectionToFolder(collectionId: string, folderId: string | null): Promise<void>;
  toggleFavorite(collectionId: string): Promise<Collection | undefined>;
}
