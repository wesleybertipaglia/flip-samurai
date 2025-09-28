'use client';

import { Route, Routes } from 'react-router-dom';

import CollectionsPage from '@/app/collections/page';
import DashboardPage from '@/app/dashboard/page';
import FavoritesPage from '@/app/favorites/page';
import FoldersPage from '@/app/folders/page';
import NotFoundPage from '@/app/notfound/page';
import CollectionContentPage from './app/collections/[id]/page';
import CollectionEditPage from './app/collections/[id]/edit/page';
import FolderContentPage from './app/folders/[id]/page';
import FolderEditPage from './app/folders/[id]/edit/page';

export default function Router() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<DashboardPage />} />

      {/* Favorites page */}
      <Route path="/favorites" element={<FavoritesPage />} />

      {/* Collections page */}
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/collections/:id" element={<CollectionContentPage />} />
      <Route path="/collections/:id/edit" element={<CollectionEditPage />} />

      {/* Folders page */}
      <Route path="/folders" element={<FoldersPage />} />
      <Route path="/folders/:id" element={<FolderContentPage />} />
      <Route path="/folders/:id/edit" element={<FolderEditPage />} />

      {/* Fallback route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}