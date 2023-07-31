import { ObjectId } from 'mongodb';
import * as z from 'zod';


function objectIdSchema(name: string) {
    return z
        .string()
        .min(1)
        .refine(
            (val) => {
                try {
                    new ObjectId(val);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            {
                message: `Invalid ObjectId for ${name}`
            }
        );
}

export const ParamsWithId = z.object({
    id: objectIdSchema('id')
});

export const ParamsWithUserId = z.object({
    user_id: objectIdSchema('user_id')
});

export const ParamsWithUserIdandId = z.object({
    id: objectIdSchema('id'),
    user_id: objectIdSchema('user_id')
});

export type ParamsWithId = z.infer<typeof ParamsWithId>;
export type ParamsWithUserId = z.infer<typeof ParamsWithUserId>;
export type ParamsWithUserIdandId = z.infer<typeof ParamsWithUserIdandId>;
