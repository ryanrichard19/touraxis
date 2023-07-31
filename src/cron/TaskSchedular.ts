import cron from 'node-cron';
import { TaskService } from '../services/tasks.service';
import Logger from '../library/Logger';

const taskService = new TaskService();

export function startJob() {
    Logger.info('Task Scheduler starting...');

    let task = cron.schedule(
        '* * * * *',
        async () => {
            const now = new Date();
            Logger.info(`This task is running every minute - ${now.getHours()}:${now.getMinutes()}`);
            const pendingTasks = await taskService.updateStatusPendingTaskstoDone();
            Logger.info(`Updated ${pendingTasks} tasks`);
        },
        {
            scheduled: true,
            timezone: 'America/Sao_Paulo'
        }
    );
    task.start();
    Logger.info('Task Scheduler started');
}
