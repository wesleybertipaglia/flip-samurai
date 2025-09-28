
'use client';

import React from 'react';
import { FolderEditPageClient } from './_components/FolderEditPageClient';

export default function FolderEditPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <FolderEditPageClient />
        </React.Suspense>
    )
}
