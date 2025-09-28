import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@progress/kendo-react-buttons';
import { useCollections } from '@/hooks/use-collections';
import { useFolders } from '@/hooks/use-folders';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@progress/kendo-react-indicators';
import type { Collection } from '@/api/collections/types';
import { chevronLeftIcon, folderIcon } from '@progress/kendo-svg-icons';
import { SvgIcon } from '@progress/kendo-react-common';
import { CollectionCard } from '@/app/collections/_components/CollectionCard';

export function FolderView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    collections,
    isInitialized: collectionsInitialized,
    exportCollectionById,
    deleteCollection,
    addCollectionToFolder,
    toggleFavorite,
  } = useCollections();

  const {
    folders,
    isInitialized: foldersInitialized,
    getFolderById,
    assignCollectionToFolder,
    unassignCollectionFromFolder,
  } = useFolders();

  const { toast } = useToast();

  const folder = useMemo(() => {
    if (!id) return null;
    return getFolderById(id);
  }, [id, getFolderById]);

  const folderCollections = useMemo<Collection[]>(() => {
    if (!folder) return [];
    return collections.filter(c => folder.collectionIds.includes(c.id));
  }, [collections, folder]);

  const isInitialized = collectionsInitialized && foldersInitialized;

  const handleEdit = (collectionId: string) => {
    navigate(`/collections/${collectionId}/edit`);
  };

  const handleDelete = (collection: Collection) => {
    deleteCollection(collection.id);
    toast({ title: 'Collection deleted.' });
  };

  const handleAddToFolder = async (collectionId: string, newFolderId: string | null) => {
    const coll = collections.find(c => c.id === collectionId);
    if (!coll) return;

    const oldFolderId = coll.folderId;

    await addCollectionToFolder(collectionId, newFolderId);

    if (oldFolderId) {
      await unassignCollectionFromFolder(oldFolderId, collectionId);
    }
    if (newFolderId) {
      await assignCollectionToFolder(newFolderId, collectionId);
      const target = folders.find(f => f.id === newFolderId);
      toast({ title: `Moved to ${target?.name}` });
    } else {
      toast({ title: 'Removed from folder' });
    }
  };

  const collectionCardProps = {
    onExport: exportCollectionById,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onSelectTag: (tag: string) => navigate(`/collections?tag=${encodeURIComponent(tag)}`),
    onAddToFolder: handleAddToFolder,
    onToggleFavorite: toggleFavorite,
  };

  if (!isInitialized) {
    return (
      <div>
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-10 w-100 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="text-center py-16">
        <h2 className="fs-3 font-bold">Folder not found</h2>
        <Button onClick={() => navigate('/folders')}>
          <SvgIcon icon={chevronLeftIcon} /> Back to Folders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <Button onClick={() => navigate('/folders')}>
          <SvgIcon icon={chevronLeftIcon} /> Back to Folders
        </Button>
      </div>

      <div className="space-y-2">
        <div className="d-flex align-items-center gap-3">
          <SvgIcon icon={folderIcon} className="k-icon k-i-folder" />
          <h1 className="fs-3 mt-3 font-bold tracking-tight">{folder.name}</h1>
        </div>
        {folder.description && <p className="text-lg text-muted-foreground">{folder.description}</p>}
        {folder.tags && folder.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-2 pt-2">
            {folder.tags.map(tag => (
              <button key={tag} onClick={() => navigate(`/folders?tag=${encodeURIComponent(tag)}`)}>
                <span className="badge badge-secondary cursor-pointer">{tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {folderCollections.length > 0 ? (
        <div className="row g-4">
          {folderCollections.map(collection => (
            <div key={collection.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
              <CollectionCard collection={collection} {...collectionCardProps} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 my-4 rounded-2 border-2 border-secondary rounded-lg" style={{ borderStyle: 'dashed !important' }}>
          <h2 className="fs-4 font-semibold">This folder is empty</h2>
          <p className="text-muted-foreground mt-2">
            You can add collections to this folder from the main collections page, or by editing this folder.
          </p>
          <div className="d-flex justify-content-center gap-4 mt-4">
            <Button onClick={() => navigate(`/folders/${folder.id}/edit`)}>Edit Folder</Button>
            <Button onClick={() => navigate('/collections')}>View All Collections</Button>
          </div>
        </div>
      )}
    </div>
  );
}