'use client';

import { Button } from '@progress/kendo-react-buttons';
import { SvgIcon } from '@progress/kendo-react-common';
import { Input } from '@progress/kendo-react-inputs';
import { xIcon } from '@progress/kendo-svg-icons';

type FoldersToolbarProps = {
    onCreateFolder: () => void;
    searchInput: string;
    onSearchInputChange: (value: string) => void;
    onSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    selectedTag: string | null;
    searchQuery: string | null;
    onClearFilters: () => void;
};

export function FoldersToolbar({
    onCreateFolder,
    searchInput,
    onSearchInputChange,
    onSearch,
    selectedTag,
    searchQuery,
    onClearFilters,
}: FoldersToolbarProps) {
    return (
        <>
            <div className="d-flex align-items-start justify-content-between mb-5 gap-4 flex-wrap">
                <Button onClick={onCreateFolder} icon={'plusIcon'}>
                    Create Folder
                </Button>

                <Input
                    placeholder="Search folders..."
                    style={{ width: '300px' }}
                    value={searchInput}
                    onChange={(e) => onSearchInputChange(e.value)}
                    onKeyDown={onSearch}
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
