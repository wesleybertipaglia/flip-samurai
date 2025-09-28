'use client';

import { Button } from '@progress/kendo-react-buttons';
import { folderIcon, moreVerticalIcon, trashIcon, pencilIcon } from '@progress/kendo-svg-icons';
import { SvgIcon } from '@progress/kendo-react-common';
import { Card, CardBody } from '@progress/kendo-react-layout';
import { Link } from 'react-router';
import { Dropdown } from '@/components/dropdown';

export function FolderCard({
    folder,
    collectionsCount,
    onEdit,
    onDelete,
    onSelectTag,
}: {
    folder: any;
    collectionsCount: number;
    onEdit: (id: string) => void;
    onDelete: (folder: any) => void;
    onSelectTag: (tag: string) => void;
}) {
    const handleEdit = () => onEdit(folder.id);
    const handleDelete = () => onDelete(folder);

    return (
        <Card className="d-flex flex-column shadow-sm overflow-visible">
            <CardBody>
                <div className="d-flex flex-column justify-content-between gap-2" style={{ minHeight: '160px' }}>
                    <div className='w-100'>
                        <div className="d-flex justify-content-between align-items-start">
                            <h3 className="m-0 d-flex align-items-center gap-2">
                                <SvgIcon icon={folderIcon} /> {folder.name}
                            </h3>
                        </div>
                        <p className="card-text text-muted m-0">{folder.description || `${collectionsCount} collection(s)`}</p>

                        {folder.tags && folder.tags.length > 0 && (
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {folder.tags.map((tag: string) => (
                                    <div key={tag} className="cursor-pointer px-2 bg-light rounded-pill border" onClick={() => onSelectTag(tag)}>
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center gap-2">
                        <Link to={`/folders/${folder.id}`} className="w-100 d-flex link-underline link-underline-opacity-0">
                            <Button className='w-100'>View Folder</Button>
                        </Link>

                        <Dropdown menuItems={[
                            { label: 'Edit', onClick: handleEdit, icon: <SvgIcon icon={pencilIcon} /> },
                            { label: 'Delete', onClick: handleDelete, icon: <SvgIcon icon={trashIcon} themeColor='error' /> }
                        ]}>
                            <Button className="bg-outline">
                                <SvgIcon icon={moreVerticalIcon} />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}