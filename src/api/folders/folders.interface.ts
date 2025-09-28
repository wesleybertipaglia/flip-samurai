import type { Folder } from './types';

export interface IFoldersService {
  getFolders(): Promise<Folder[]>;
  getFolderById(id: string): Promise<Folder | undefined>;
  addFolder(data: { name: string; description?: string; tags?: string[] }): Promise<Folder>;
  updateFolder(folder: Folder): Promise<Folder>;
  deleteFolder(id: string): Promise<void>;
  addCollectionToFolder(folderId: string, collectionId: string): Promise<void>;
  removeCollectionFromFolder(folderId: string, collectionId: string): Promise<void>;
}
