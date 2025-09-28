
'use client';

import React from 'react';
import { FolderView } from './_components/FolderView';

export default function FolderContentPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <FolderView />
        </React.Suspense>
    )
}
