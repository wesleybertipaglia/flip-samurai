import { z } from 'zod';

export const createCollectionSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }).max(50, { message: 'Name must be at most 50 characters long.' }),
});

export type CreateCollectionSchema = z.infer<typeof createCollectionSchema>;

export const editCollectionSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }).max(50, { message: 'Name must be at most 50 characters long.' }),
  description: z.string().max(280, { message: 'Description must be at most 280 characters long.' }).optional(),
  tags: z.string().optional(),
});

export type EditCollectionSchema = z.infer<typeof editCollectionSchema>;

export const addCardSchema = z.object({
  front: z.string().min(1, { message: 'Front of the card cannot be empty.' }).max(280, { message: 'Front must be at most 280 characters long.' }),
  back: z.string().min(1, { message: 'Back of the card cannot be empty.' }).max(280, { message: 'Back must be at most 280 characters long.' }),
});

export type AddCardSchema = z.infer<typeof addCardSchema>;

export const aiCreateCollectionSchema = z.object({
    idea: z.string().min(10, { message: 'Idea must be at least 10 characters long.' }).max(200, { message: 'Idea must be at most 200 characters long.' }),
});

export type AiCreateCollectionSchema = z.infer<typeof aiCreateCollectionSchema>;
