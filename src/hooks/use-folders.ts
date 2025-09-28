'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Folder } from '@/api/folders/types';
import { getFoldersService } from '@/lib/services';

const foldersService = getFoldersService();

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadFolders = useCallback(async () => {
      try {
        const loadedFolders = await foldersService.getFolders();
        setFolders(loadedFolders);
      } catch (error) {
        console.error("Failed to load folders", error);
        setFolders([]);
      } finally {
        setIsInitialized(true);
      }
  }, []);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const addFolder = useCallback(async (name: string, description?: string, tags?: string[]) => {
    const newFolder = await foldersService.addFolder({ name, description, tags });
    await loadFolders();
    return newFolder.id;
  }, [loadFolders]);

  const getFolderById = useCallback((id: string) => {
    return folders.find(f => f.id === id);
  }, [folders]);

  const updateFolder = useCallback(async (updatedFolder: Folder) => {
    await foldersService.updateFolder(updatedFolder);
    await loadFolders();
  }, [loadFolders]);

  const deleteFolder = useCallback(async (id: string) => {
    await foldersService.deleteFolder(id);
    await loadFolders();
  }, [loadFolders]);

  const assignCollectionToFolder = useCallback(async (folderId: string, collectionId: string) => {
    await foldersService.addCollectionToFolder(folderId, collectionId);
    await loadFolders();
  }, [loadFolders]);

  const unassignCollectionFromFolder = useCallback(async (folderId: string, collectionId: string) => {
    await foldersService.removeCollectionFromFolder(folderId, collectionId);
    await loadFolders();
  }, [loadFolders]);

  return {
    folders,
    isInitialized,
    addFolder,
    getFolderById,
    updateFolder,
    deleteFolder,
    assignCollectionToFolder,
    unassignCollectionFromFolder,
  };
}
