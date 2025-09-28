'use client';

import React from 'react';
import { FavoritesPageClient } from './_components/FavoritesPageClient';

export default function FavoritesPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <FavoritesPageClient />
        </React.Suspense>
    )
}