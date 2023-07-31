import { Router } from 'express';
import * as UserControllers from '../controllers/users.contoller';
import { validateRequest } from '../middlewares';
import { User } from '../model/users.model';
import { ParamsWithId } from '../interfaces/ParamsWithId';

const router = Router();

router.get('/', UserControllers.getAllUsers);
router.get(
    '/:id',
    validateRequest({
        params: ParamsWithId
    }),
    UserControllers.getUserById
);
router.post(
    '/',
    validateRequest({
        body: User
    }),
    UserControllers.createUser
);

router.put(
    '/:id',
    validateRequest({
        params: ParamsWithId
    }),
    UserControllers.updateUser
);

router.delete(
    '/:id',
    validateRequest({
        params: ParamsWithId
    }),
    UserControllers.deleteUser
);

export default router;
