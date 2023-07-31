import { Response, Request, NextFunction } from 'express';
import { Task, TaskDTO, TaskWithId } from '../model/tasks.model';
import { TaskService } from '../services/tasks.service';

const taskService = new TaskService();

export async function getAllTasks(req: Request<{ user_id: string }>, res: Response<TaskWithId[]>, next: NextFunction) {
    try {
        console.log(req.params.user_id, 'getAllTasks')
        const tasks = await taskService.getAllTasks(req.params.user_id);
        res.json(tasks);
    } catch (error) {
        next(error);
    }
}

export async function getTaskById(req: Request<{ user_id: string, id: string }, TaskWithId, {}>, res: Response<TaskWithId>, next: NextFunction) {
    try {
        const user = await taskService.getTaskById(req.params.user_id, req.params.id);
        if (!user) {
            res.status(404);
            throw new Error(`Task with id "${req.params.id}" not found.`);
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function createTask(req: Request<{ user_id: string }, TaskWithId, TaskDTO>, res: Response<TaskWithId>, next: NextFunction) {
    try {
        const user = await taskService.createTask(req.params.user_id, req.body);
        res.status(201);
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function updateTask(req: Request<{ user_id: string, id: string }, TaskWithId, Task>, res: Response<TaskWithId>, next: NextFunction) {
    try {
        const user = await taskService.updateTask(req.params.user_id, req.params.id, req.body);
        if (!user) {
            res.status(404);
            throw new Error(`Task with id "${req.params.id}" not found.`);
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
}

export async function deleteTask(req: Request<{ user_id: string, id: string }, {}, {}>, res: Response<{}>, next: NextFunction) {
    try {
        const result = await taskService.deleteTask(req.params.user_id, req.params.id);
        if (!result) {
            res.status(404);
            throw new Error(`Task with id "${req.params.id}" not found.`);
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}
