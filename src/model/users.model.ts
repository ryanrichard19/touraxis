import * as z from 'zod';
import { db } from '../db';
import { WithId } from 'mongodb';

export const User = z.object({
    username: z.string({ required_error: 'username is required' }),
    first_name: z.string({ required_error: 'first_name is required' }),
    last_name: z.string({ required_error: 'last_name is required' })
});

export type User = z.infer<typeof User>;
export type UserWithId = WithId<User>;
export const Users = db.collection<User>('users');
