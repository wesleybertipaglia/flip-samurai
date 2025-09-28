'use client';

import React from 'react';
import { CollectionsPageClient } from './_components/CollectionsPageClient';

export default function CollectionsPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <CollectionsPageClient />
        </React.Suspense>
    )
}
