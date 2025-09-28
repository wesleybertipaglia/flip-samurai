'use client';

import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { TextArea } from '@progress/kendo-react-inputs';
import { type UseFormReturn, Controller } from 'react-hook-form';
import type { CreateCollectionSchema, AiCreateCollectionSchema } from '@/api/collections/collections.schema';
import type { Collection } from '@/api/collections/types';

type CollectionDialogsProps = {
    isCreateDialogOpen: boolean;
    setIsCreateDialogOpen: (isOpen: boolean) => void;
    createForm: UseFormReturn<CreateCollectionSchema>;
    handleCreateCollection: (data: CreateCollectionSchema) => void;

    isDeleteDialogOpen: boolean;
    closeDeleteDialog: () => void;
    collectionToDelete: Collection | null;
    deleteConfirmationInput: string;
    setDeleteConfirmationInput: (input: string) => void;
    handleDeleteCollection: () => void;

    isApiKeyDialogOpen: boolean;
    setIsApiKeyDialogOpen: (isOpen: boolean) => void;
    apiKey: string;
    setApiKey: (key: string) => void;
    handleSaveApiKey: () => void;

    isAiCreateDialogOpen: boolean;
    setIsAiCreateDialogOpen: (isOpen: boolean) => void;
    aiCreateForm: UseFormReturn<AiCreateCollectionSchema>;
    handleGenerateWithAi: (data: AiCreateCollectionSchema) => void;
    isAiLoading: boolean;
};

export function CollectionDialogs({
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    createForm,
    handleCreateCollection,
    isDeleteDialogOpen,
    closeDeleteDialog,
    collectionToDelete,
    deleteConfirmationInput,
    setDeleteConfirmationInput,
    handleDeleteCollection,
    isApiKeyDialogOpen,
    setIsApiKeyDialogOpen,
    apiKey,
    setApiKey,
    handleSaveApiKey,
    isAiCreateDialogOpen,
    setIsAiCreateDialogOpen,
    aiCreateForm,
    handleGenerateWithAi,
    isAiLoading,
}: CollectionDialogsProps) {
    return (
        <>
            {/* Create Collection Dialog */}
            {isCreateDialogOpen && (
                <Dialog title="Create New Collection" onClose={() => setIsCreateDialogOpen(false)}>
                    <form onSubmit={createForm.handleSubmit(handleCreateCollection)} style={{ width: '500px' }}>
                        <div className="py-4">
                            <label htmlFor="name" className="block text-sm font-medium">Name</label>
                            <Controller
                                name="name"
                                control={createForm.control}
                                render={({ field }) => (
                                    <Input
                                        id="name"
                                        {...field}
                                        autoFocus
                                        className="mt-2"
                                    />
                                )}
                            />
                            {createForm.formState.errors.name && (
                                <p className="text-red-500 text-xs mt-1">{createForm.formState.errors.name?.message}</p>
                            )}
                        </div>
                        <DialogActionsBar>
                            <Button type="submit">Create</Button>
                        </DialogActionsBar>
                    </form>
                </Dialog>
            )}

            {/* Delete Collection Dialog */}
            {isDeleteDialogOpen && (
                <Dialog title="Delete Collection" onClose={closeDeleteDialog}>
                    <p className="p-4" style={{ width: '500px' }}>
                        Are you sure you want to delete the <strong>{collectionToDelete?.name}</strong> collection? This action cannot be undone. Please type <strong>delete</strong> to confirm.
                    </p>
                    <div className="py-4">
                        <Input
                            value={deleteConfirmationInput}
                            onChange={(e) => setDeleteConfirmationInput(e.value)}
                            placeholder="delete"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleDeleteCollection()}
                        />
                    </div>
                    <DialogActionsBar>
                        <Button themeColor="base" onClick={closeDeleteDialog}>Cancel</Button>
                        <Button themeColor="error" onClick={handleDeleteCollection}>Delete</Button>
                    </DialogActionsBar>
                </Dialog>
            )}

            {/* API Key Dialog */}
            {isApiKeyDialogOpen && (
                <Dialog title="Enter Gemini API Key" onClose={() => setIsApiKeyDialogOpen(false)}>
                    <p className="p-4" style={{ width: '500px' }}>
                        To use the AI creation feature, please enter your Google AI Gemini API key. It will be stored locally in your browser. Learn more about obtaining an API key{" "}
                        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="underline text-blue-500">here</a>.
                    </p>
                    <div className="py-4">
                        <Input
                            id="gemini-api-key"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.value)}
                            placeholder="Enter your API Key"
                            autoFocus
                        />
                    </div>
                    <DialogActionsBar>
                        <Button type="submit" onClick={handleSaveApiKey}>Save Key</Button>
                    </DialogActionsBar>
                </Dialog>
            )}

            {/* AI Collection Create Dialog */}
            {isAiCreateDialogOpen && (
                <Dialog title="Create Collection with AI" onClose={() => setIsAiCreateDialogOpen(false)} >
                    <p className="p-4" style={{ width: '500px' }}>
                        Describe the topic or subject for your new flashcard collection. The AI will generate a set of cards for you.
                    </p>
                    <form onSubmit={aiCreateForm.handleSubmit(handleGenerateWithAi)}>
                        <div className="py-4">
                            <label htmlFor="idea" className="block text-sm font-medium">Idea</label>
                            <Controller
                                name="idea"
                                control={aiCreateForm.control}
                                render={({ field }) => (
                                    <TextArea
                                        id="idea"
                                        {...field}
                                        placeholder="e.g., 'Key events of the American Revolution' or 'Common Spanish phrases for beginners'"
                                        autoFocus
                                        className="mt-2"
                                    />
                                )}
                            />
                            {aiCreateForm.formState.errors.idea && (
                                <p className="text-red-500 text-xs mt-1">{aiCreateForm.formState.errors.idea?.message}</p>
                            )}
                        </div>
                        <DialogActionsBar>
                            <Button type="submit" disabled={isAiLoading}>
                                {isAiLoading ? 'Generating...' : 'Generate'}
                            </Button>
                        </DialogActionsBar>
                    </form>
                </Dialog>
            )}
        </>
    );
}