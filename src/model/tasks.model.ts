import * as z from 'zod';
import { db } from '../db';
import { WithId } from 'mongodb';

export const Task = z.object({
    name: z.string(),
    description: z.string(),
    date_time: z.date(),
    user_id: z.string().optional(),
    status: z.string().default('pending')
});

export const TaskDTO = z.object({
    id: z.string().optional(),
    name: z.string(),
    description: z.string(),
    date_time: z.string(),
    user_id: z.string().optional(),
    status: z.string().default('pending')
});

export type TaskDTO = z.infer<typeof TaskDTO>;
export type Task = z.infer<typeof Task>;
export type TaskWithId = WithId<Task>;
export const Tasks = db.collection<Task>('tasks');
