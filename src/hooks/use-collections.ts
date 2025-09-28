
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Collection, Flashcard } from '@/api/collections/types';
import { getCollectionsService } from '@/lib/services';
import { useProgress } from './use-progress';
import { tinid } from '@wesleybertipaglia/tinid';
import { differenceInDays } from '@/lib/date-utils';

const collectionsService = getCollectionsService();

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { addProgress, getLastRevisedDate } = useProgress();

  const loadCollections = useCallback(async () => {
    try {
      const loadedCollections = await collectionsService.getCollections();
      setCollections(loadedCollections);
    } catch (error) {
      console.error("Failed to load collections", error);
      setCollections([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const cardsToReview = useMemo(() => {
    const today = new Date();
    const allCards = collections.flatMap(c =>
      c.cards.map(card => ({ ...card, collectionId: c.id }))
    );
    const toReview = allCards.filter(c => {
      const lastRevised = getLastRevisedDate(c.id);
      return !lastRevised || differenceInDays(today, new Date(lastRevised)) >= 7;
    });
    return {
      id: 'cards-to-review',
      name: 'Cards to Review',
      description: `Cards not reviewed in the last 7 days.`,
      cards: toReview,
      source: 'created',
      isFavorite: false,
    } as Collection;
  }, [collections, getLastRevisedDate]);

  const getCollectionById = useCallback((id: string) => {
    if (id === 'cards-to-review') {
      return cardsToReview;
    }
    return collections.find(c => c.id === id);
  }, [collections, cardsToReview]);

  const addCollection = useCallback(async (name: string, description?: string, tags?: string[], cards?: Flashcard[]) => {
    const newCollection = await collectionsService.addCollection({ name, description, tags, cards });
    await loadCollections();
    return newCollection.id;
  }, [loadCollections]);

  const updateCollection = useCallback(async (updatedCollection: Collection) => {
    await collectionsService.updateCollection(updatedCollection);
    await loadCollections();
  }, [loadCollections]);

  const deleteCollection = useCallback(async (id: string) => {
    await collectionsService.deleteCollection(id);
    await loadCollections();
  }, [loadCollections]);

  const addCardToCollection = useCallback(async (collectionId: string, card: Omit<Flashcard, 'id'>) => {
    await collectionsService.addCardToCollection(collectionId, card);
    await loadCollections();
  }, [loadCollections]);

  const deleteCardFromCollection = useCallback(async (collectionId: string, cardId: string) => {
    await collectionsService.deleteCardFromCollection(collectionId, cardId);
    await loadCollections();
  }, [loadCollections]);

  const importCollections = useCallback(async (importedData: any): Promise<boolean> => {
    const collections = await collectionsService.getCollections();
    const processCollection = (collection: any): Collection | null => {
      if (!collection.id || !collection.name || !Array.isArray(collection.cards)) {
        return null;
      }
      if (collections.some(c => c.id === collection.id)) {
        return null;
      }
      const newCollection: Collection = {
        id: collection.id,
        name: collection.name,
        description: collection.description || '',
        tags: collection.tags || [],
        cards: collection.cards.map((card: any) => ({
          id: card.id || tinid(),
          front: card.front,
          back: card.back,
        })),
        source: collection.source === 'ai-generated' ? 'ai-generated' : 'imported',
        isFavorite: collection.isFavorite || false,
        folderId: collection.folderId,
      };
      return newCollection;
    };

    let collectionsToImport: Collection[] = [];
    if (Array.isArray(importedData)) {
      collectionsToImport = importedData.map(processCollection).filter((c): c is Collection => c !== null);
    } else if (typeof importedData === 'object' && importedData !== null) {
      const singleCollection = processCollection(importedData);
      if (singleCollection) {
        collectionsToImport = [singleCollection];
      }
    }

    if (collectionsToImport.length > 0) {
      await collectionsService.importCollections(collectionsToImport);
      await loadCollections();
      return true;
    }

    return false;
  }, [loadCollections]);

  const exportCollectionById = useCallback((collectionId: string) => {
    collectionsService.exportCollectionById(collectionId);
  }, []);

  const finishStudySession = useCallback(async (collection: Collection) => {
    await addProgress(collection.id, 'collection');
    for (const card of collection.cards) {
      await addProgress(card.id, 'card');
    }
  }, [addProgress]);

  const addCollectionToFolder = useCallback(async (collectionId: string, folderId: string | null) => {
    await collectionsService.addCollectionToFolder(collectionId, folderId);
    await loadCollections();
  }, [loadCollections]);

  const toggleFavorite = useCallback(async (collectionId: string) => {
    await collectionsService.toggleFavorite(collectionId);
    await loadCollections();
  }, [loadCollections]);

  return {
    collections,
    isInitialized,
    getCollectionById,
    addCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    deleteCardFromCollection,
    importCollections,
    exportCollectionById,
    finishStudySession,
    cardsToReview,
    addCollectionToFolder,
    toggleFavorite
  };
}
