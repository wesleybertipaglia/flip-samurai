'use client';

import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import type { SubmitHandler } from 'react-hook-form';
import type { Folder } from '@/api/folders/types';
import type { CreateFolderSchema } from '@/api/folders/folders.schema';

type FolderDialogsProps = {
    isCreateDialogOpen: boolean;
    setIsCreateDialogOpen: (isOpen: boolean) => void;
    createForm: any;
    handleCreateFolder: SubmitHandler<CreateFolderSchema>;

    isDeleteDialogOpen: boolean;
    closeDeleteDialog: () => void;
    folderToDelete: Folder | null;
    deleteConfirmationInput: string;
    setDeleteConfirmationInput: (input: string) => void;
    handleDeleteFolder: () => void;
};

export function FolderDialogs({
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    createForm,
    handleCreateFolder,

    isDeleteDialogOpen,
    closeDeleteDialog,
    folderToDelete,
    deleteConfirmationInput,
    setDeleteConfirmationInput,
    handleDeleteFolder,
}: FolderDialogsProps) {
    return (
        <>
            {/* Create Folder Dialog */}
            {isCreateDialogOpen && (
                <Dialog title="Create New Folder" onClose={() => setIsCreateDialogOpen(false)}>
                    <form onSubmit={createForm.handleSubmit(handleCreateFolder)} style={{ width: '500px' }}>
                        <div className="pb-4 mb-4 border-bottom">
                            <label htmlFor="name" className="block text-sm font-medium m-0 mb-1">Folder Name</label>
                            <input
                                id="name"
                                {...createForm.register('name')}
                                autoFocus
                                className="p-2 w-100 border rounded"
                            />
                            {createForm.formState.errors.name && (
                                <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.name?.message}</p>
                            )}
                        </div>

                        <div className='d-flex flex-column gap-2'>
                            <Button type="submit" themeColor={'primary'}>Create</Button>
                            <Button type="button" className='bg-outline border' onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Dialog>
            )}

            {/* Delete Folder Dialog */}
            {isDeleteDialogOpen && (
                <Dialog title="Delete Folder" onClose={closeDeleteDialog}>
                    <div className="p-4" style={{ width: '500px' }}>
                        <p>Are you sure you want to delete the folder "{folderToDelete?.name}"? This action cannot be undone. Please type <strong>delete</strong> to confirm.</p>
                        <Input
                            value={deleteConfirmationInput}
                            onChange={(e) => setDeleteConfirmationInput(e.value)}
                            placeholder="delete"
                            autoFocus
                            className="mt-4"
                            onKeyDown={(e) => e.key === 'Enter' && handleDeleteFolder()}
                        />
                    </div>
                    <DialogActionsBar>
                        <Button onClick={closeDeleteDialog}>Cancel</Button>
                        <Button onClick={() => { handleDeleteFolder(); closeDeleteDialog(); }} className="text-destructive">Delete</Button>
                    </DialogActionsBar>
                </Dialog>
            )}
        </>
    );
}
