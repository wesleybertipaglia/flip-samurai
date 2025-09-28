'use client';

import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { Skeleton } from '@progress/kendo-react-indicators';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFolders } from '@/hooks/use-folders';
import { useCollections } from '@/hooks/use-collections';
import { useToast } from '@/hooks/use-toast';
import { EditFolderDetails } from './EditFolderDetails';
import { ManageFolderCollections } from './ManageFolderCollections';
import { editFolderSchema, type EditFolderSchema } from '@/api/folders/folders.schema';
import type { Folder } from '@/api/folders/types';
import { SvgIcon } from '@progress/kendo-react-common';
import { chevronLeftIcon } from '@progress/kendo-svg-icons';

export function FolderEditPageClient() {
  const navigate = useNavigate();
  const params = useParams();
  const { getFolderById, updateFolder, assignCollectionToFolder, unassignCollectionFromFolder, isInitialized: foldersInitialized } = useFolders();
  const { collections, addCollectionToFolder, isInitialized: collectionsInitialized } = useCollections();
  const { toast } = useToast();

  const folderId = params.id as string;
  const originalFolder = useMemo(() => getFolderById(folderId), [folderId, getFolderById]);

  const [folder, setFolder] = useState<Folder | undefined>(originalFolder);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

  const editForm = useForm<EditFolderSchema>({
    resolver: zodResolver(editFolderSchema),
    defaultValues: { name: '', description: '', tags: '' },
  });

  const isInitialized = foldersInitialized && collectionsInitialized;

  useEffect(() => {
    if (originalFolder) {
      setFolder(originalFolder);
      setSelectedCollectionIds(originalFolder?.collectionIds || []);
      editForm.reset({
        name: originalFolder.name,
        description: originalFolder.description || '',
        tags: originalFolder.tags?.join(', ') || '',
      });
    }
  }, [originalFolder, editForm]);

  if (!isInitialized) {
    return (
      <div>
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-100" />
            <Skeleton className="h-24 w-100" />
            <Skeleton className="h-10 w-100" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-12 w-100" />
            <Skeleton className="h-12 w-100" />
            <Skeleton className="h-12 w-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="text-center py-16">
        <h2 className="fs-3 font-bold">Folder not found</h2>
        <Button themeColor={"base"} className="mt-4" onClick={() => navigate('/folders')}>
          <SvgIcon icon={chevronLeftIcon} /> Back to Folders
        </Button>
      </div>
    );
  }

  const handleSaveChanges = async (data: EditFolderSchema) => {
    if (folder && originalFolder) {
      const updatedTags = (data.tags ?? '').split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      const updatedFolder = { ...folder, name: data.name, description: data.description, tags: updatedTags };
      updateFolder(updatedFolder);

      const originalIds = new Set(originalFolder.collectionIds);
      const currentIds = new Set(selectedCollectionIds);

      const addedIds = selectedCollectionIds.filter(id => !originalIds.has(id));
      const removedIds = originalFolder.collectionIds.filter(id => !currentIds.has(id));

      addedIds.forEach(collectionId => {
        assignCollectionToFolder(folder.id, collectionId);
        addCollectionToFolder(collectionId, folder.id);
      });

      removedIds.forEach(collectionId => {
        unassignCollectionFromFolder(folder.id, collectionId);
        addCollectionToFolder(collectionId, null);
      });

      toast({ title: 'Success', description: 'Folder updated successfully.' });
      navigate('/folders');
    }
  };

  const handleCollectionToggle = (collectionId: string, isChecked: boolean) => {
    setSelectedCollectionIds(prev =>
      isChecked ? [...prev, collectionId] : prev.filter(id => id !== collectionId)
    );
  };

  const unassignedCollections = collections.filter(c => !c.folderId || c.folderId === folderId);

  return (
    <div>
      <div className="mb-5">
        <Button size="small" onClick={() => navigate('/folders')}>
          <SvgIcon icon={chevronLeftIcon} /> Back to Folders
        </Button>
      </div>

      <div className="row">
        <div className='col-4'>
          <EditFolderDetails
            form={editForm}
            onSaveChanges={handleSaveChanges}
          />
        </div>

        <div className='col-8'>
          <ManageFolderCollections
            unassignedCollections={unassignedCollections}
            selectedCollectionIds={selectedCollectionIds}
            onCollectionToggle={handleCollectionToggle}
          />
        </div>
      </div>
    </div>
  );
}
