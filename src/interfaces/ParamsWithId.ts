import { ObjectId } from 'mongodb';
import * as z from 'zod';

export const ParamsWithId = z.object({
    id: z
        .string()
        .min(1)
        .refine(
            (val) => {
                try {
                    return new ObjectId(val);
                } catch (error) {
                    return false;
                }
            },
            {
                message: 'Invalid ObjectId'
            }
        )
});

export const ParamsWithUserId = z.object({
    user_id: z
        .string()
        .min(1)
        .refine((val) => {
            try {
                return new ObjectId(val);
            } catch (error) {
                return false;
            }
        })
});

export const ParamsWithUserIdandId = z.object({
    id: z
        .string()
        .min(1)
        .refine(
            (val) => {
                try {
                    return new ObjectId(val);
                } catch (error) {
                    return false;
                }
            },
            {
                message: 'Invalid ObjectId'
            }
        ),
    user_id: z
        .string()
        .min(1)
        .refine((val) => {
            try {
                return new ObjectId(val);
            } catch (error) {
                return false;
            }
        })
});

export type ParamsWithId = z.infer<typeof ParamsWithId>;
export type ParamsWithUserId = z.infer<typeof ParamsWithUserId>;
export type ParamsWithUserIdandId = z.infer<typeof ParamsWithUserIdandId>;
