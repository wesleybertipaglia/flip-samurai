'use client';

import { Input } from '@progress/kendo-react-inputs';
import { searchIcon, xIcon } from '@progress/kendo-svg-icons';
import { Button } from '@progress/kendo-react-buttons';
import { SvgIcon } from '@progress/kendo-react-common';

type FavoritesToolbarProps = {
    searchInput: string;
    setSearchInput: (value: string) => void;
    handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    selectedTag: string | null;
    searchQuery: string | null;
    clearAllFilters: () => void;
};

export function FavoritesToolbar({
    searchInput,
    setSearchInput,
    handleSearch,
    selectedTag,
    searchQuery,
    clearAllFilters
}: FavoritesToolbarProps) {
    return (
        <>
            <div className="d-flex align-items-start justify-content-end mb-4 gap-4">
                <Input
                    placeholder="Search collections..."
                    style={{ width: '300px' }}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.value)}
                    onKeyDown={handleSearch}
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
                        <Button themeColor={"base"} size="small" onClick={clearAllFilters} className="btn btn-sm btn-outline-secondary d-flex align-items-center">
                            <SvgIcon icon={xIcon} className="me-1" style={{ width: '1rem', height: '1rem' }} /> Clear filters
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
