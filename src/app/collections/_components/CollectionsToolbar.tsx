'use client';

import { Button } from '@progress/kendo-react-buttons';
import { SvgIcon } from '@progress/kendo-react-common';
import { Input } from '@progress/kendo-react-inputs';
import { fileAddIcon, uploadIcon, sparklesIcon, xIcon } from '@progress/kendo-svg-icons';

type CollectionsToolbarProps = {
    onShowCreateDialog: () => void;
    onShowAiCreateDialog: () => void;
    onImportClick: () => void;
    searchInput: string;
    onSearchInputChange: (value: string) => void;
    onSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    selectedTag: string | null;
    searchQuery: string | null;
    onClearFilters: () => void;
};

export function CollectionsToolbar({
    onShowCreateDialog,
    onShowAiCreateDialog,
    onImportClick,
    searchInput,
    onSearchInputChange,
    onSearch,
    selectedTag,
    searchQuery,
    onClearFilters
}: CollectionsToolbarProps) {
    return (
        <>
            <div className="d-flex align-items-start justify-content-between gap-4 mb-5">
                <div className="d-flex gap-2 w-100">
                    <Button onClick={onShowAiCreateDialog} className="btn btn-primary">
                        <SvgIcon icon={sparklesIcon} className="me-2" /> Create with AI
                    </Button>
                    <Button onClick={onShowCreateDialog} className="btn btn-secondary">
                        <SvgIcon icon={fileAddIcon} className="me-2" /> Create Collection
                    </Button>
                    <Button themeColor={"base"} onClick={onImportClick} className="btn btn-outline-secondary">
                        <SvgIcon icon={uploadIcon} className="me-2" /> Import
                    </Button>
                </div>
                <Input
                    placeholder="Search collections..."
                    value={searchInput}
                    onChange={(e) => onSearchInputChange(e.value)}
                    onKeyDown={onSearch}
                    style={{ width: '300px' }}
                />
            </div>

            {(selectedTag || searchQuery) && (
                <div className="mb-4 d-flex align-items-center gap-3 flex-wrap">
                    <div className="d-flex gap-2 flex-wrap align-items-center">
                        {selectedTag && (
                            <p className="mb-0 small">
                                Tag: {selectedTag}
                            </p>
                        )}
                        {searchQuery && (
                            <p className="mb-0 small">
                                Query: {searchQuery}
                            </p>
                        )}
                        <Button themeColor={"base"} size="small" onClick={onClearFilters} className="btn btn-sm btn-outline-secondary d-flex align-items-center">
                            <SvgIcon icon={xIcon} className="me-1" style={{ width: '1rem', height: '1rem' }} /> Clear filters
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}