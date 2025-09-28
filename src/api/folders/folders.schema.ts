import { z } from 'zod';

export const createFolderSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }).max(50, { message: 'Name must be at most 50 characters long.' }),
});

export type CreateFolderSchema = z.infer<typeof createFolderSchema>;

export const editFolderSchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }).max(50, { message: 'Name must be at most 50 characters long.' }),
    description: z.string().max(280, { message: 'Description must be at most 280 characters long.' }).optional(),
    tags: z.string().optional(),
});

export type EditFolderSchema = z.infer<typeof editFolderSchema>;
