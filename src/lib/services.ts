import type { ICollectionsService } from '@/api/collections/collections.interface';
import { collectionsMockService } from '@/api/collections/collections.mock.service';
import type { IFoldersService } from '@/api/folders/folders.interface';
import { foldersMockService } from '@/api/folders/folders.mock.service';
import type { IProgressService } from '@/api/progress/progress.interface';
import { progressMockService } from '@/api/progress/progress.mock.service';

const useMock = true; 

export function getCollectionsService(): ICollectionsService {
  if (useMock) {
    return collectionsMockService;
  }
  throw new Error('No collections service implementation selected');
}

export function getFoldersService(): IFoldersService {
  if (useMock) {
    return foldersMockService;
  }
  throw new Error('No folders service implementation selected');
}

export function getProgressService(): IProgressService {
    if (useMock) {
        return progressMockService;
    }
    throw new Error('No progress service implementation selected');
}
