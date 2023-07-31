import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import users from '../router/users.routes';
import tasks from '../router/tasks.routes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏'
    });
});

router.use('/users', users);
router.use('/users', tasks);

export default router;
