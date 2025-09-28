'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFolders } from '@/hooks/use-folders';
import { useCollections } from '@/hooks/use-collections';
import { useToast } from '@/hooks/use-toast';
import { FoldersToolbar } from './FoldersToolbar';
import { FoldersGrid } from './FoldersGrid';
import { FolderDialogs } from './FolderDialogs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFolderSchema, type CreateFolderSchema } from '@/api/folders/folders.schema';
import type { Folder } from '@/api/folders/types';

export function FoldersPageClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const { folders, isInitialized, addFolder, deleteFolder } = useFolders();
  const { addCollectionToFolder } = useCollections();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const selectedTag = searchParams.get('tag');
  const searchQuery = searchParams.get('q');
  const [searchInput, setSearchInput] = useState(searchQuery || '');

  const createForm = useForm<CreateFolderSchema>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    setSearchInput(searchQuery || '');
  }, [searchQuery]);

  const filteredFolders = useMemo(() => {
    let filtered = folders;

    if (selectedTag) {
      filtered = filtered.filter(folder => folder.tags?.includes(selectedTag));
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(folder =>
        folder.name.toLowerCase().includes(lowercasedQuery) ||
        (folder.description && folder.description.toLowerCase().includes(lowercasedQuery))
      );
    }

    return filtered;
  }, [folders, selectedTag, searchQuery]);

  const handleCreateFolder = async (data: CreateFolderSchema) => {
    const newId = await addFolder(data.name);
    setIsCreateDialogOpen(false);
    createForm.reset();
    toast({ title: 'Folder created!' });
    navigate(`/folders/${newId}/edit`);
  };

  const openDeleteDialog = (folder: Folder) => {
    setFolderToDelete(folder);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setFolderToDelete(null);
    setIsDeleteDialogOpen(false);
    setDeleteConfirmationInput('');
  };

  const handleDeleteFolder = async () => {
    if (folderToDelete && deleteConfirmationInput.toLowerCase() === 'delete') {
      for (const collectionId of folderToDelete.collectionIds) {
        await addCollectionToFolder(collectionId, null);
      }
      await deleteFolder(folderToDelete.id);
      toast({ title: 'Folder deleted.' });
      closeDeleteDialog();
    } else {
      toast({ variant: 'error', title: 'Deletion failed', description: 'Please type "delete" to confirm.' });
    }
  };

  const handleEdit = (id: string) => navigate(`/folders/${id}/edit`);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams(location.search);
      if (searchInput.trim()) {
        params.set('q', searchInput.trim());
      } else {
        params.delete('q');
      }
      navigate(`/folders?${params.toString()}`);
    }
  };

  const clearAllFilters = () => {
    navigate('/folders');
  };

  const navigateWithTag = (tag: string) => {
    const params = new URLSearchParams(location.search);
    params.set('tag', tag);
    navigate(`/folders?${params.toString()}`);
  };

  return (
    <div className="space-y-8">
      <FoldersToolbar
        onCreateFolder={() => setIsCreateDialogOpen(true)}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        selectedTag={selectedTag}
        searchQuery={searchQuery}
        onClearFilters={clearAllFilters}
      />
      <FoldersGrid
        isInitialized={isInitialized}
        filteredFolders={filteredFolders}
        searchQuery={searchQuery}
        selectedTag={selectedTag}
        onClearFilters={clearAllFilters}
        onCreateFolder={() => setIsCreateDialogOpen(true)}
        onEdit={handleEdit}
        onDelete={openDeleteDialog}
        onSelectTag={navigateWithTag}
      />
      <FolderDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        createForm={createForm}
        handleCreateFolder={handleCreateFolder}
        isDeleteDialogOpen={isDeleteDialogOpen}
        closeDeleteDialog={closeDeleteDialog}
        folderToDelete={folderToDelete}
        deleteConfirmationInput={deleteConfirmationInput}
        setDeleteConfirmationInput={setDeleteConfirmationInput}
        handleDeleteFolder={handleDeleteFolder}
      />
    </div>
  );
}