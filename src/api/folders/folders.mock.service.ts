
'use client';

import type { Folder } from './types';
import { tinid } from '@wesleybertipaglia/tinid';
import { getItem, setItem, initializeItem } from '@/lib/storage';
import type { IFoldersService } from './folders.interface';

const FOLDERS_STORAGE_KEY = 'folders';

class FoldersMockService implements IFoldersService {
  constructor() {
    initializeItem(FOLDERS_STORAGE_KEY, []);
  }

  private loadFoldersFromStorage(): Folder[] {
    return getItem<Folder[]>(FOLDERS_STORAGE_KEY, []);
  }

  private saveFoldersToStorage(folders: Folder[]) {
    setItem(FOLDERS_STORAGE_KEY, folders);
  }

  async getFolders(): Promise<Folder[]> {
    const folders = this.loadFoldersFromStorage();
    return Promise.resolve(folders);
  }

  async getFolderById(id: string): Promise<Folder | undefined> {
    const folders = this.loadFoldersFromStorage();
    return Promise.resolve(folders.find(f => f.id === id));
  }

  async addFolder(data: { name: string; description?: string; tags?: string[] }): Promise<Folder> {
    const folders = this.loadFoldersFromStorage();
    const newFolder: Folder = {
      id: tinid(),
      name: data.name,
      description: data.description || '',
      tags: data.tags || [],
      collectionIds: [],
    };
    const newFolders = [...folders, newFolder];
    this.saveFoldersToStorage(newFolders);
    return Promise.resolve(newFolder);
  }

  async updateFolder(updatedFolder: Folder): Promise<Folder> {
    let folders = this.loadFoldersFromStorage();
    folders = folders.map(f => f.id === updatedFolder.id ? updatedFolder : f);
    this.saveFoldersToStorage(folders);
    return Promise.resolve(updatedFolder);
  }

  async deleteFolder(id: string): Promise<void> {
    let folders = this.loadFoldersFromStorage();
    folders = folders.filter(f => f.id !== id);
    this.saveFoldersToStorage(folders);
    return Promise.resolve();
  }

  async addCollectionToFolder(folderId: string, collectionId: string): Promise<void> {
    let folders = this.loadFoldersFromStorage();
    folders = folders.map(f => {
      if (f.id === folderId) {
        if (!f.collectionIds.includes(collectionId)) {
          return { ...f, collectionIds: [...f.collectionIds, collectionId] };
        }
      }
      else if (f.collectionIds.includes(collectionId)) {
        return { ...f, collectionIds: f.collectionIds.filter(id => id !== collectionId) };
      }
      return f;
    });
    this.saveFoldersToStorage(folders);
    return Promise.resolve();
  }

  async removeCollectionFromFolder(folderId: string, collectionId: string): Promise<void> {
    let folders = this.loadFoldersFromStorage();
    folders = folders.map(f => {
      if (f.id === folderId && f.collectionIds.includes(collectionId)) {
        return { ...f, collectionIds: f.collectionIds.filter(id => id !== collectionId) };
      }
      return f;
    });
    this.saveFoldersToStorage(folders);
    return Promise.resolve();
  }
}

export const foldersMockService = new FoldersMockService();
