import { Router } from 'express';
import * as TaskControllers from '../controllers/tasks.contoller';
import { validateRequest } from '../middlewares';
import { TaskDTO } from '../model/tasks.model';
import { ParamsWithUserId, ParamsWithUserIdandId } from '../interfaces/ParamsWithId';

const router = Router();

router.get(
    '/:user_id/tasks/',
    validateRequest({
        params: ParamsWithUserId
    }),
    TaskControllers.getAllTasks
);

router.get(
    '/:user_id/tasks/:id',
    validateRequest({
        params: ParamsWithUserIdandId
    }),
    TaskControllers.getTaskById
);

router.post(
    '/:user_id/tasks/',
    validateRequest({
        params: ParamsWithUserId,
        body: TaskDTO
    }),
    TaskControllers.createTask
);

router.put(
    '/:user_id/tasks/:id',
    validateRequest({
        params: ParamsWithUserIdandId
    }),
    TaskControllers.updateTask
);

router.delete(
    '/:user_id/tasks/:id',
    validateRequest({
        params: ParamsWithUserIdandId
    }),
    TaskControllers.deleteTask
);

export default router;
