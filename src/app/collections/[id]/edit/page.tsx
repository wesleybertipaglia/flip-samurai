'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { TextArea } from '@progress/kendo-react-inputs';
import { Card, CardBody } from '@progress/kendo-react-layout';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { chevronLeftIcon, plusIcon, trashIcon, pencilIcon } from '@progress/kendo-svg-icons';
import { useToast } from '@/hooks/use-toast';
import { useCollections } from '@/hooks/use-collections';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addCardSchema, editCollectionSchema, type AddCardSchema, type EditCollectionSchema } from '@/api/collections/collections.schema';
import type { Collection, Flashcard } from '@/api/collections/types';
import { Skeleton } from '@progress/kendo-react-indicators';
import { SvgIcon } from '@progress/kendo-react-common';

function FlashCardItem({ card, onDeleteConfirm, onEdit }: {
    card: Flashcard;
    collectionId: string;
    onDeleteConfirm: (card: Flashcard) => void;
    onEdit: (card: Flashcard) => void;
}) {
    return (
        <div className="d-flex justify-content-between align-items-start border-bottom border-light py-3">
            <div className="flex-grow-1 me-3">
                <p className="fw-medium mb-1">Front:</p>
                <p className="text-muted mb-2">{card.front}</p>
                <p className="fw-medium mb-1">Back:</p>
                <p className="text-muted m-0">{card.back}</p>
            </div>
            <div className="d-flex flex-column gap-2">
                <Button
                    themeColor="base"
                    size="small"
                    title="Edit Card"
                    onClick={() => onEdit(card)}
                >
                    <SvgIcon icon={pencilIcon} />
                </Button>
                <Button
                    themeColor="error"
                    size="small"
                    title="Delete Card"
                    onClick={() => onDeleteConfirm(card)}
                >
                    <SvgIcon icon={trashIcon} />
                </Button>
            </div>
        </div>
    );
}


export default function CollectionEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getCollectionById, updateCollection, addCardToCollection, deleteCardFromCollection, isInitialized } = useCollections();
    const { toast } = useToast();

    const originalCollection = useMemo(() => getCollectionById(id ?? ''), [id, getCollectionById]);
    const [collection, setCollection] = useState<Collection | undefined>(originalCollection);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [isEditCardOpen, setIsEditCardOpen] = useState(false);
    const [cardToEdit, setCardToEdit] = useState<Flashcard | null>(null);
    const [isConfirmDeleteCardOpen, setIsConfirmDeleteCardOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<Flashcard | null>(null);
    const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

    const editForm = useForm<EditCollectionSchema>({
        resolver: zodResolver(editCollectionSchema),
        defaultValues: {
            name: '',
            description: '',
            tags: '',
        },
    });

    const addCardForm = useForm<AddCardSchema>({
        resolver: zodResolver(addCardSchema),
        defaultValues: {
            front: '',
            back: '',
        },
    });

    const editCardForm = useForm<AddCardSchema>({
        resolver: zodResolver(addCardSchema),
        defaultValues: { front: '', back: '' },
    });


    useEffect(() => {
        if (originalCollection) {
            setCollection(originalCollection);
            editForm.reset({
                name: originalCollection.name,
                description: originalCollection.description,
                tags: originalCollection.tags?.join(', ') || '',
            });
        }
    }, [originalCollection, editForm]);

    useEffect(() => {
        if (isEditCardOpen && cardToEdit) {
            editCardForm.reset({
                front: cardToEdit.front,
                back: cardToEdit.back,
            });
        }
    }, [isEditCardOpen, cardToEdit, editCardForm]);


    if (!isInitialized) {
        return (
            <div className="container">
                <Skeleton className="h-10 w-25 mb-4" />
                <div className="row g-4">
                    <div className="col-md-4 space-y-4">
                        <Skeleton className="h-6 w-50 mb-2" />
                        <Skeleton className="h-10 w-100" />
                        <Skeleton className="h-24 w-100" />
                        <Skeleton className="h-10 w-100" />
                        <Skeleton className="h-10 w-75" />
                    </div>
                    <div className="col-md-8 space-y-4">
                        <Skeleton className="h-6 w-25 mb-2" />
                        <Skeleton className="h-12 w-100" />
                        <Skeleton className="h-12 w-100" />
                        <Skeleton className="h-12 w-100" />
                    </div>
                </div>
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="py-5 text-center">
                <h2 className="fs-3 fw-bold">Collection not found</h2>
                <Button themeColor="base" className="mt-4" onClick={() => navigate('/collections')}>
                    <SvgIcon icon={chevronLeftIcon} className="me-2" /> Back to Collections
                </Button>
            </div>
        );
    }

    const handleUpdateDetails: SubmitHandler<EditCollectionSchema> = (data) => {
        if (collection) {
            const updatedTags = (data.tags ?? '').split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);
            updateCollection({ ...collection, ...data, tags: updatedTags });
            toast({ title: 'Success', description: 'Collection details updated.' });
        }
    };

    const handleAddCard: SubmitHandler<AddCardSchema> = (data) => {
        if (collection) {
            addCardToCollection(collection.id, data);
            addCardForm.reset();
            setIsAddCardOpen(false);
            toast({ title: 'Card added!' });
        }
    };

    const handleEditCardOpen = (card: Flashcard) => {
        setCardToEdit(card);
        setIsEditCardOpen(true);
    };

    const handleEditCardSubmit: SubmitHandler<AddCardSchema> = (data) => {
        if (collection && cardToEdit) {
            const updatedCards = collection.cards.map(c =>
                c.id === cardToEdit.id ? { ...c, front: data.front, back: data.back } : c
            );
            updateCollection({ ...collection, cards: updatedCards });

            setIsEditCardOpen(false);
            setCardToEdit(null);
            toast({ title: 'Card updated!' });
        }
    };

    const handleDeleteCardConfirm = (card: Flashcard) => {
        setCardToDelete(card);
        setIsConfirmDeleteCardOpen(true);
    };

    const handleDeleteCardFinal = () => {
        if (cardToDelete && collection && deleteConfirmationInput.toLowerCase() === 'delete') {
            deleteCardFromCollection(collection.id, cardToDelete.id);
            setIsConfirmDeleteCardOpen(false);
            setCardToDelete(null);
            setDeleteConfirmationInput('');
            toast({ title: 'Card deleted.' });
        } else {
            toast({ variant: 'error', title: 'Deletion failed', description: 'Please type "delete" to confirm.' });
        }
    };

    return (
        <div>
            <div className="mb-4">
                <Button themeColor="base" size="small" onClick={() => navigate('/collections')}>
                    <SvgIcon icon={chevronLeftIcon} className="me-2" /> Back to Collections
                </Button>
            </div>

            <div className="row g-4">
                <div className="col-md-4">
                    <Card className='shadow-sm'>
                        <CardBody>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <SvgIcon icon={pencilIcon} /> <h5 className='m-0'>Edit Details</h5>
                            </div>

                            <form onSubmit={editForm.handleSubmit(handleUpdateDetails)} className="d-flex flex-column gap-3">
                                <div>
                                    <label htmlFor="name" className="form-label fw-medium">Name</label>
                                    <Controller
                                        name="name"
                                        control={editForm.control}
                                        render={({ field }) => (
                                            <Input id="name" {...field} className="mt-2 w-100" />
                                        )}
                                    />
                                    {editForm.formState.errors.name && (
                                        <p className="text-danger small mt-1">{editForm.formState.errors.name?.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="description" className="form-label fw-medium">Description</label>
                                    <Controller
                                        name="description"
                                        control={editForm.control}
                                        render={({ field }) => (
                                            <TextArea id="description" {...field} className="mt-2 w-100" />
                                        )}
                                    />
                                    {editForm.formState.errors.description && (
                                        <p className="text-danger small mt-1">{editForm.formState.errors.description?.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="tags" className="form-label fw-medium">Tags</label>
                                    <Controller
                                        name="tags"
                                        control={editForm.control}
                                        render={({ field }) => (
                                            <Input id="tags" {...field} placeholder="e.g. science, history" className="mt-2 w-100" />
                                        )}
                                    />
                                    <p className="form-text text-muted">Separate tags with commas.</p>
                                    {editForm.formState.errors.tags && (
                                        <p className="text-danger small mt-1">{editForm.formState.errors.tags?.message}</p>
                                    )}
                                </div>
                                <div className="pt-3 mt-3 border-top">
                                    <Button type="submit" className="w-100">Save Changes</Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>

                <div className="col-md-8">
                    <Card>
                        <CardBody>
                            <div className="d-flex flex-row align-items-center justify-content-between mb-3">
                                <h5 className='m-0'>Cards in Collection ({collection.cards.length})</h5>
                                <Button themeColor="base" size="small" onClick={() => setIsAddCardOpen(true)}>
                                    <SvgIcon icon={plusIcon} className="me-2" /> Add Card
                                </Button>
                            </div>

                            {collection.cards.length > 0 ? (
                                <div className="mt-3">
                                    {collection.cards.map(card => (
                                        <FlashCardItem
                                            key={card.id}
                                            card={card}
                                            collectionId={collection.id}
                                            onDeleteConfirm={handleDeleteCardConfirm}
                                            onEdit={handleEditCardOpen}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    This collection has no cards yet.
                                </div>
                            )}

                            {isAddCardOpen && (
                                <Dialog onClose={() => setIsAddCardOpen(false)} title="Add New Card">
                                    <form onSubmit={addCardForm.handleSubmit(handleAddCard)} className="d-flex flex-column gap-3 py-4" style={{ width: '500px' }}>
                                        <div>
                                            <label htmlFor="front" className="form-label fw-medium">Front</label>
                                            <Controller
                                                name="front"
                                                control={addCardForm.control}
                                                render={({ field }) => (
                                                    <TextArea
                                                        id="front"
                                                        {...field}
                                                        placeholder="e.g., What is the capital of France?"
                                                        className="mt-2 w-100"
                                                    />
                                                )}
                                            />
                                            {addCardForm.formState.errors.front && (
                                                <p className="text-danger small mt-1">{addCardForm.formState.errors.front?.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="back" className="form-label fw-medium">Back</label>
                                            <Controller
                                                name="back"
                                                control={addCardForm.control}
                                                render={({ field }) => (
                                                    <TextArea
                                                        id="back"
                                                        {...field}
                                                        placeholder="e.g., Paris"
                                                        className="mt-2 w-100"
                                                    />
                                                )}
                                            />
                                            {addCardForm.formState.errors.back && (
                                                <p className="text-danger small mt-1">{addCardForm.formState.errors.back?.message}</p>
                                            )}
                                        </div>
                                        <DialogActionsBar>
                                            <Button type="button" onClick={() => setIsAddCardOpen(false)}>Cancel</Button>
                                            <Button type="submit" themeColor="primary">Add Card</Button>
                                        </DialogActionsBar>
                                    </form>
                                </Dialog>
                            )}

                            {isEditCardOpen && cardToEdit && (
                                <Dialog onClose={() => setIsEditCardOpen(false)} title={`Edit Card`}>
                                    <form onSubmit={editCardForm.handleSubmit(handleEditCardSubmit)} className="d-flex flex-column gap-3 py-4" style={{ width: '500px' }}>
                                        <div>
                                            <label htmlFor="edit-front" className="form-label fw-medium">Front</label>
                                            <Controller
                                                name="front"
                                                control={editCardForm.control}
                                                render={({ field }) => (
                                                    <TextArea id="edit-front" {...field} className="mt-2 w-100" />
                                                )}
                                            />
                                            {editCardForm.formState.errors.front && (
                                                <p className="text-danger small mt-1">{editCardForm.formState.errors.front?.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="edit-back" className="form-label fw-medium">Back</label>
                                            <Controller
                                                name="back"
                                                control={editCardForm.control}
                                                render={({ field }) => (
                                                    <TextArea id="edit-back" {...field} className="mt-2 w-100" />
                                                )}
                                            />
                                            {editCardForm.formState.errors.back && (
                                                <p className="text-danger small mt-1">{editCardForm.formState.errors.back?.message}</p>
                                            )}
                                        </div>
                                        <DialogActionsBar>
                                            <Button type="button" onClick={() => setIsEditCardOpen(false)}>Cancel</Button>
                                            <Button type="submit" themeColor="primary">Save Changes</Button>
                                        </DialogActionsBar>
                                    </form>
                                </Dialog>
                            )}

                            {isConfirmDeleteCardOpen && cardToDelete && (
                                <Dialog onClose={() => setIsConfirmDeleteCardOpen(false)} title="Confirm Deletion">
                                    <div className='py-3' style={{ width: '500px' }}>
                                        <p>Are you sure you want to delete this card?</p>
                                        <p className='fw-bold text-danger'>"{cardToDelete.front.substring(0, 50)}{cardToDelete.front.length > 50 ? '...' : ''}"</p>
                                        <p>Please type "delete" to confirm.</p>

                                        <Input
                                            className='w-100 mt-2'
                                            value={deleteConfirmationInput}
                                            onChange={(e) => setDeleteConfirmationInput(e.value)}
                                        />
                                    </div>
                                    <DialogActionsBar>
                                        <Button type="button" onClick={() => setIsConfirmDeleteCardOpen(false)}>Cancel</Button>
                                        <Button
                                            themeColor="error"
                                            onClick={handleDeleteCardFinal}
                                            disabled={deleteConfirmationInput.toLowerCase() !== 'delete'}
                                        >
                                            Delete Card
                                        </Button>
                                    </DialogActionsBar>
                                </Dialog>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div >
    );
}