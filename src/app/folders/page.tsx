
'use client';

import React from 'react';
import { FoldersPageClient } from './_components/FoldersPageClient';

export default function FoldersPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <FoldersPageClient />
        </React.Suspense>
    )
}
