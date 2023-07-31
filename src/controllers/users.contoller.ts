import { Response, Request, NextFunction } from 'express';
import { User, UserWithId } from '../model/users.model';
import { UserService } from '../services/user.service';


const userService = new UserService();

export async function getAllUsers(req: Request, res: Response<UserWithId[]>, next: NextFunction) {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
}

export async function getUserById(req: Request<{ id: string }, UserWithId, {}>, res: Response<UserWithId>, next: NextFunction) {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error(`User with id "${req.params.id}" not found.`);
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function createUser(req: Request<{}, UserWithId, User>, res: Response<UserWithId>, next: NextFunction) {
    try {
        const user = await userService.createUser(req.body);
        res.status(201);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function updateUser(req: Request<{ id: string }, UserWithId, User>, res: Response<UserWithId>, next: NextFunction) {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) {
            res.status(404);
            throw new Error(`User with id "${req.params.id}" not found.`);
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req: Request<{ id: string }, {}, {}>, res: Response<{}>, next: NextFunction) {
    try {
        const result = await userService.deleteUser(req.params.id);
        if (!result) {
            res.status(404);
            throw new Error(`User with id "${req.params.id}" not found.`);
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}
