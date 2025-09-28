'use client';

import { useFolders } from '@/hooks/use-folders';
import { useProgress } from '@/hooks/use-progress';
import type { Collection } from '@/api/collections/types';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardBody } from '@progress/kendo-react-layout';
import { moreVerticalIcon, trashIcon, pencilIcon, clockIcon, downloadIcon, folderAddIcon, starIcon } from '@progress/kendo-svg-icons';
import { Dropdown } from '@/components/dropdown';
import { Link } from 'react-router';
import { SvgIcon } from '@progress/kendo-react-common';
import type { MenuItem } from '@/components/dropdown';

export function CollectionCard({
  collection,
  onExport,
  onEdit,
  onDelete,
  onSelectTag,
  onAddToFolder,
  onToggleFavorite
}: {
  collection: Collection;
  onExport: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (collection: Collection) => void;
  onSelectTag: (tag: string) => void;
  onAddToFolder: (collectionId: string, folderId: string | null) => void;
  onToggleFavorite: (id: string) => void;
}) {
  const { folders } = useFolders();
  const { getLastRevisedDate } = useProgress();
  const lastRevised = getLastRevisedDate(collection.id);

  const handleExport = () => onExport(collection.id);
  const handleEdit = () => onEdit(collection.id);
  const handleDelete = () => onDelete(collection);

  const handleAddToFolder = (folderId: string | null) => onAddToFolder(collection.id, folderId);

  const collectionFolderIds = folders
    .filter(folder => folder.collectionIds.includes(collection.id))
    .map(folder => folder.id);

  const folderSubMenuItems = [
    {
      label: 'None',
      onClick: () => handleAddToFolder(null),
      isHighlighted: collectionFolderIds.length === 0,
      isDisabled: collectionFolderIds.length === 0,
    },
    ...folders.map(folder => ({
      label: folder.name,
      onClick: () => handleAddToFolder(folder.id),
      isHighlighted: collectionFolderIds.includes(folder.id),
    })),
  ];

  const menuItems: MenuItem[] = [
    {
      label: 'Add to Folder',
      icon: <SvgIcon icon={folderAddIcon} />,
      subMenuItems: folderSubMenuItems,
    },
    { label: 'Export', onClick: handleExport, icon: <SvgIcon icon={downloadIcon} /> },
    { label: 'Edit', onClick: handleEdit, icon: <SvgIcon icon={pencilIcon} /> },
    { label: 'Delete', onClick: handleDelete, icon: <SvgIcon icon={trashIcon} themeColor='error' /> }
  ];

  return (
    <Card className="d-flex flex-column shadow-sm overflow-visible">
      <CardBody>
        <div className="d-flex flex-column justify-content-between gap-2" style={{ minHeight: '200px' }}>
          <div className='w-100'>
            <div className="d-flex justify-content-between align-items-start">
              <p className='m-0'>{collection.name}</p>
              <Button themeColor={'base'} className="bg-outline border-0" onClick={() => onToggleFavorite(collection.id)}>
                <SvgIcon icon={starIcon} size='large' themeColor={collection.isFavorite ? "warning" : "secondary"} />
              </Button>
            </div>
            <p className="card-text text-muted m-0">{collection.description || `${collection.cards.length} card(s)`}</p>

            {lastRevised && (
              <p className="text-xs text-muted-foreground d-flex align-items-center gap-1 mt-2">
                <SvgIcon icon={clockIcon} className="h-3 w-3" /> Last revised: {new Date(lastRevised).toLocaleDateString()}
              </p>
            )}
            {collection.tags && collection.tags.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {collection.tags.map(tag => (
                  <div key={tag} className="cursor-pointer px-2 bg-light rounded-pill border" onClick={() => onSelectTag(tag)}>
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center gap-2">
            <Link to={`/collections/${collection.id}`} className='w-100 d-flex link-underline link-underline-opacity-0'>
              <Button className='w-100'>Start Studying</Button>
            </Link>

            <Dropdown menuItems={menuItems}>
              <Button className='bg-outline'>
                <SvgIcon icon={moreVerticalIcon} />
              </Button>
            </Dropdown>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}