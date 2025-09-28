'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCollections } from '@/hooks/use-collections';
import { useFolders } from '@/hooks/use-folders';
import { useToast } from '@/hooks/use-toast';
import type { Collection } from '@/api/collections/types';
import { CollectionsToolbar } from './CollectionsToolbar';
import { CollectionsGrid } from './CollectionsGrid';
import { CollectionDialogs } from './CollectionDialogs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCollectionSchema, aiCreateCollectionSchema, type CreateCollectionSchema, type AiCreateCollectionSchema } from '@/api/collections/collections.schema';

const GEMINI_API_KEY_STORAGE = 'gemini_api_key';

export function CollectionsPageClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collections, isInitialized, addCollection, importCollections, exportCollectionById, deleteCollection, cardsToReview, addCollectionToFolder, toggleFavorite, createAndAddCollectionWithAi } = useCollections();
  const { folders, assignCollectionToFolder, unassignCollectionFromFolder } = useFolders();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryParams = new URLSearchParams(location.search);
  const selectedTag = queryParams.get('tag');
  const searchQuery = queryParams.get('q');
  const [searchInput, setSearchInput] = useState(searchQuery || '');

  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isAiCreateDialogOpen, setIsAiCreateDialogOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const createForm = useForm<CreateCollectionSchema>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: { name: '' },
  });

  const aiCreateForm = useForm<AiCreateCollectionSchema>({
    resolver: zodResolver(aiCreateCollectionSchema),
    defaultValues: { idea: '' },
  });

  useEffect(() => {
    setSearchInput(searchQuery || '');
  }, [searchQuery]);

  const displayedCollections = useMemo(() => {
    let filtered = [...collections];

    if (selectedTag) {
      filtered = filtered.filter(collection => collection.tags?.includes(selectedTag));
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(lowercasedQuery) ||
        (collection.description && collection.description.toLowerCase().includes(lowercasedQuery))
      );
    }

    return filtered;
  }, [collections, selectedTag, searchQuery]);

  const handleCreateCollection = async (data: CreateCollectionSchema) => {
    const newId = await addCollection(data.name);
    setIsCreateDialogOpen(false);
    createForm.reset();
    toast({ title: 'Collection created!', description: 'Now add some cards to it.' });
    navigate(`/collections/${newId}/edit`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const data = JSON.parse(content);
            const success = await importCollections(data);
            if (success) {
              toast({ title: 'Success', description: 'Collection imported successfully.' });
            } else {
              throw new Error('Invalid file format or collection already exists.');
            }
          }
        } catch (error) {
          toast({ variant: 'error', title: 'Import Failed', description: 'Please select a valid JSON file. Collections may also already exist.' });
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openDeleteDialog = (collection: Collection) => {
    setCollectionToDelete(collection);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setCollectionToDelete(null);
    setIsDeleteDialogOpen(false);
    setDeleteConfirmationInput('');
  };

  const handleDeleteCollection = () => {
    if (collectionToDelete && deleteConfirmationInput.toLowerCase() === 'delete') {
      deleteCollection(collectionToDelete.id);
      toast({ title: 'Collection deleted.' });
      closeDeleteDialog();
    } else {
      toast({ variant: 'error', title: 'Deletion failed', description: 'Please type "delete" to confirm.' });
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams(queryParams.toString());
      if (searchInput.trim()) {
        params.set('q', searchInput.trim());
      } else {
        params.delete('q');
      }
      navigate(`/collections?${params.toString()}`);
    }
  };

  const clearAllFilters = () => {
    navigate('/collections');
  };

  const navigateWithTag = (tag: string) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set('tag', tag);
    navigate(`/collections?${params.toString()}`);
  };

  const handleEdit = (id: string) => navigate(`/collections/${id}/edit`);

  const handleAddToFolder = async (collectionId: string, folderId: string | null) => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;

    const oldFolderId = collection.folderId;

    await addCollectionToFolder(collectionId, folderId);

    if (oldFolderId) {
      await unassignCollectionFromFolder(oldFolderId, collectionId);
    }

    if (folderId) {
      await assignCollectionToFolder(folderId, collectionId);
      const folder = folders.find(f => f.id === folderId);
      toast({ title: `Moved to ${folder?.name}` });
    } else {
      toast({ title: 'Removed from folder' });
    }
  };

  const handleAiCreateClick = () => {
    const storedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    if (storedKey) {
      setApiKey(storedKey);
      setIsAiCreateDialogOpen(true);
    } else {
      setIsApiKeyDialogOpen(true);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, apiKey.trim());
      setIsApiKeyDialogOpen(false);
      setIsAiCreateDialogOpen(true);
      toast({ title: 'API Key Saved' });
    } else {
      toast({ variant: 'error', title: 'Invalid API Key' });
    }
  };

  const handleGenerateWithAi = async (data: AiCreateCollectionSchema) => {
    setIsAiLoading(true);
    try {
      await createAndAddCollectionWithAi({ idea: data.idea, apiKey });
      toast({ title: 'AI Collection Created!', description: 'Your new collection is ready.' });
      setIsAiCreateDialogOpen(false);
      aiCreateForm.reset();
    } catch (error) {
      console.error("AI generation failed:", error);
      toast({ variant: 'error', title: 'AI Generation Failed', description: String(error) });
    } finally {
      setIsAiLoading(false);
    }
  };

  const collectionCardProps = {
    onExport: exportCollectionById,
    onEdit: handleEdit,
    onDelete: openDeleteDialog,
    onSelectTag: navigateWithTag,
    onAddToFolder: handleAddToFolder,
    onToggleFavorite: toggleFavorite,
  };

  const showReviewCard = !selectedTag && !searchQuery && cardsToReview.cards.length > 0;

  return (
    <div className="space-y-8">
      <CollectionsToolbar
        onShowCreateDialog={() => setIsCreateDialogOpen(true)}
        onShowAiCreateDialog={handleAiCreateClick}
        onImportClick={handleImportClick}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        selectedTag={selectedTag}
        searchQuery={searchQuery}
        onClearFilters={clearAllFilters}
      />
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="d-none" accept=".json" />

      <CollectionsGrid
        isInitialized={isInitialized}
        displayedCollections={displayedCollections}
        cardsToReview={cardsToReview}
        showReviewCard={showReviewCard}
        searchQuery={searchQuery}
        selectedTag={selectedTag}
        collectionCardProps={collectionCardProps}
        onClearFilters={clearAllFilters}
        onShowCreateDialog={() => setIsCreateDialogOpen(true)}
      />

      <CollectionDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        createForm={createForm}
        handleCreateCollection={handleCreateCollection}

        isDeleteDialogOpen={isDeleteDialogOpen}
        closeDeleteDialog={closeDeleteDialog}
        collectionToDelete={collectionToDelete}
        deleteConfirmationInput={deleteConfirmationInput}
        setDeleteConfirmationInput={setDeleteConfirmationInput}
        handleDeleteCollection={handleDeleteCollection}

        isApiKeyDialogOpen={isApiKeyDialogOpen}
        setIsApiKeyDialogOpen={setIsApiKeyDialogOpen}
        apiKey={apiKey}
        setApiKey={setApiKey}
        handleSaveApiKey={handleSaveApiKey}

        isAiCreateDialogOpen={isAiCreateDialogOpen}
        setIsAiCreateDialogOpen={setIsAiCreateDialogOpen}
        aiCreateForm={aiCreateForm}
        handleGenerateWithAi={handleGenerateWithAi}
        isAiLoading={isAiLoading}
      />
    </div>
  );
}
