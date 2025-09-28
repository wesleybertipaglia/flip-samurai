'use client';

import { Button } from '@progress/kendo-react-buttons';
import { Card, CardBody } from '@progress/kendo-react-layout';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { useForm, Controller } from 'react-hook-form';
import type { EditFolderSchema } from '@/api/folders/folders.schema';
import { SvgIcon } from '@progress/kendo-react-common';
import { saveIcon } from '@progress/kendo-svg-icons';

type EditFolderDetailsProps = {
    form: ReturnType<typeof useForm<EditFolderSchema>>;
    onSaveChanges: (data: EditFolderSchema) => void;
};

export function EditFolderDetails({
    form,
    onSaveChanges,
}: EditFolderDetailsProps) {
    return (
        <Card className='shadow-sm'>
            <CardBody>
                <div>
                    <h3>Edit Folder</h3>
                </div>

                <form onSubmit={form.handleSubmit(onSaveChanges)} className="d-flex flex-column gap-3">
                    <div>
                        <label htmlFor="name" className="form-label fw-medium">Name</label>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    id="name"
                                    {...field}
                                    className="w-100"
                                />
                            )}
                        />
                        {form.formState.errors.name && (
                            <p className="text-danger small mt-1">{form.formState.errors.name?.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="form-label fw-medium">Description</label>
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <TextArea
                                    id="description"
                                    {...field}
                                    className="w-100"
                                />
                            )}
                        />
                        {form.formState.errors.description && (
                            <p className="text-danger small mt-1">{form.formState.errors.description?.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="tags" className="form-label fw-medium">Tags</label>
                        <Controller
                            name="tags"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    id="tags"
                                    {...field}
                                    placeholder="e.g. english, grammar"
                                    className="w-100"
                                />
                            )}
                        />
                        <p className="form-text text-muted">Separate tags with commas.</p>
                        {form.formState.errors.tags && (
                            <p className="text-danger small mt-1">{form.formState.errors.tags?.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="mt-2">
                        <SvgIcon icon={saveIcon} className="me-2" /> Save Changes
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}