'use client';

import type { Collection, Flashcard } from './types';
import { initialCollections } from './data';
import { tinid } from '@wesleybertipaglia/tinid';
import { getItem, setItem, initializeItem } from '@/lib/storage';
import type { ICollectionsService } from './collections.interface';

const COLLECTIONS_STORAGE_KEY = 'collections';
const API_BASE_URL = 'https://flip-samurai-api.onrender.com/api/v1';

class CollectionsMockService implements ICollectionsService {
  constructor() {
    initializeItem(COLLECTIONS_STORAGE_KEY, initialCollections);
  }

  private loadCollectionsFromStorage(): Collection[] {
    return getItem<Collection[]>(COLLECTIONS_STORAGE_KEY, []);
  }

  private saveCollectionsToStorage(collections: Collection[]) {
    setItem(COLLECTIONS_STORAGE_KEY, collections);
  }

  async getCollections(): Promise<Collection[]> {
    const collections = this.loadCollectionsFromStorage();
    return Promise.resolve(collections);
  }

  async getCollectionById(id: string): Promise<Collection | undefined> {
    const collections = this.loadCollectionsFromStorage();
    return Promise.resolve(collections.find(c => c.id === id));
  }

  async addCollection(data: { name: string; description?: string; tags?: string[], cards?: Flashcard[] }): Promise<Collection> {
    const collections = this.loadCollectionsFromStorage();
    const newCollection: Collection = {
      id: tinid(),
      name: data.name,
      description: data.description || 'A new collection.',
      cards: data.cards || [],
      tags: data.tags || [],
      source: 'created',
      isFavorite: false,
    };
    const newCollections = [...collections, newCollection];
    this.saveCollectionsToStorage(newCollections);
    return Promise.resolve(newCollection);
  }

  async updateCollection(updatedCollection: Collection): Promise<Collection> {
    let collections = this.loadCollectionsFromStorage();
    collections = collections.map(c => c.id === updatedCollection.id ? updatedCollection : c);
    this.saveCollectionsToStorage(collections);
    return Promise.resolve(updatedCollection);
  }

  async deleteCollection(id: string): Promise<void> {
    let collections = this.loadCollectionsFromStorage();
    collections = collections.filter(c => c.id !== id);
    this.saveCollectionsToStorage(collections);
    return Promise.resolve();
  }

  async addCardToCollection(collectionId: string, card: Omit<Flashcard, 'id'>): Promise<Flashcard> {
    const collections = this.loadCollectionsFromStorage();
    const newCard: Flashcard = { ...card, id: tinid() };
    const newCollections = collections.map(c => {
      if (c.id === collectionId) {
        return { ...c, cards: [...c.cards, newCard] };
      }
      return c;
    });
    this.saveCollectionsToStorage(newCollections);
    return Promise.resolve(newCard);
  }

  async deleteCardFromCollection(collectionId: string, cardId: string): Promise<void> {
    const collections = this.loadCollectionsFromStorage();
    const newCollections = collections.map(c => {
      if (c.id === collectionId) {
        return { ...c, cards: c.cards.filter(card => card.id !== cardId) };
      }
      return c;
    });
    this.saveCollectionsToStorage(newCollections);
    return Promise.resolve();
  }

  async importCollections(collectionsToImport: Collection[]): Promise<void> {
    const currentCollections = this.loadCollectionsFromStorage();
    const newCollections = [...currentCollections, ...collectionsToImport];
    this.saveCollectionsToStorage(newCollections);
    return Promise.resolve();
  }

  async exportCollectionById(collectionId: string): Promise<void> {
    const collections = this.loadCollectionsFromStorage();
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return Promise.resolve();

    const sanitizedCollection = {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      tags: collection.tags,
      cards: collection.cards.map(({ front, back }) => ({ front, back })),
    };

    const dataStr = JSON.stringify(sanitizedCollection, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${collection.name.replace(/\s+/g, '_').toLowerCase()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    return Promise.resolve();
  }

  async addCollectionToFolder(collectionId: string, folderId: string | null): Promise<void> {
    let collections = this.loadCollectionsFromStorage();
    collections = collections.map(c =>
      c.id === collectionId ? { ...c, folderId: folderId ?? undefined } : c
    );
    this.saveCollectionsToStorage(collections);
    return Promise.resolve();
  }

  async toggleFavorite(collectionId: string): Promise<Collection | undefined> {
    let collections = this.loadCollectionsFromStorage();
    let updatedCollection: Collection | undefined;
    collections = collections.map(c => {
      if (c.id === collectionId) {
        updatedCollection = { ...c, isFavorite: !c.isFavorite };
        return updatedCollection;
      }
      return c;
    });
    this.saveCollectionsToStorage(collections);
    return Promise.resolve(updatedCollection);
  }

  async generateCollectionFromAI(data: {
    idea: string;
    apiKey: string;
  }): Promise<Collection> {
    const response = await fetch(`${API_BASE_URL}/ai/collection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: data.idea,
        apiKey: data.apiKey,
      }),
    });

    if (!response.ok) {
      let errorMessage = `API call failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
      }
      throw new Error(errorMessage);
    }

    const newCollection: Collection = await response.json();

    const collections = this.loadCollectionsFromStorage();
    const collectionWithId: Collection = {
      ...newCollection,
      id: tinid(),
      source: 'ai-generated'
    };

    const newCollections = [...collections, collectionWithId];
    this.saveCollectionsToStorage(newCollections);

    return collectionWithId;
  }
}

export const collectionsMockService = new CollectionsMockService();
