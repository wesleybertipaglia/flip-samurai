'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCollections } from '@/hooks/use-collections';
import { useFolders } from '@/hooks/use-folders';
import { useToast } from '@/hooks/use-toast';
import type { Collection } from '@/api/collections/types';
import { FavoritesToolbar } from './FavoritesToolbar';
import { FavoritesGrid } from './FavoritesGrid';

export function FavoritesPageClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collections, isInitialized, exportCollectionById, deleteCollection, addCollectionToFolder, toggleFavorite } = useCollections();
  const { folders, assignCollectionToFolder } = useFolders();
  const { toast } = useToast();

  const params = new URLSearchParams(location.search);
  const selectedTag = params.get('tag');
  const searchQuery = params.get('q');
  const [searchInput, setSearchInput] = useState(searchQuery || '');

  useEffect(() => {
    setSearchInput(searchQuery || '');
  }, [searchQuery]);

  const favoriteCollections = useMemo(() => {
    let filtered = collections.filter(c => c.isFavorite);

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

  const handleEdit = (id: string) => navigate(`/collections/${id}/edit`);

  const handleDelete = (collection: Collection) => {
    deleteCollection(collection.id);
    toast({ title: 'Collection deleted.' });
  };

  const handleAddToFolder = (collectionId: string, folderId: string | null) => {
    addCollectionToFolder(collectionId, folderId);
    if (folderId) {
      assignCollectionToFolder(folderId, collectionId);
      const targetFolder = folders.find(f => f.id === folderId);
      toast({ title: `Moved to ${targetFolder?.name}` });
    } else {
      toast({ title: 'Removed from folder' });
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams(location.search);
      if (searchInput.trim()) {
        params.set('q', searchInput.trim());
      } else {
        params.delete('q');
      }
      navigate(`/favorites?${params.toString()}`);
    }
  };

  const clearAllFilters = () => {
    navigate('/favorites');
  };

  const navigateWithTag = (tag: string) => {
    const params = new URLSearchParams(location.search);
    params.set('tag', tag);
    navigate(`/favorites?${params.toString()}`);
  }

  const collectionCardProps = {
    onExport: exportCollectionById,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onSelectTag: navigateWithTag,
    onAddToFolder: handleAddToFolder,
    onToggleFavorite: toggleFavorite,
  };

  return (
    <div className="space-y-8">
      <FavoritesToolbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        selectedTag={selectedTag}
        searchQuery={searchQuery}
        clearAllFilters={clearAllFilters}
      />
      <FavoritesGrid
        isInitialized={isInitialized}
        favoriteCollections={favoriteCollections}
        collectionCardProps={collectionCardProps}
        searchQuery={searchQuery}
        selectedTag={selectedTag}
      />
    </div>
  );
}
