import cron from 'node-cron';
import { TaskService } from '../services/tasks.service';

const taskService = new TaskService();

export function startJob() {
    console.log('Task Scheduler starting...');

    let task = cron.schedule(
        '* * * * *',
        async () => {
            const now = new Date();
            console.log(`This task is running every minute - ${now.getHours()}:${now.getMinutes()}`);
            const pendingTasks = await taskService.updateStatusPendingTaskstoDone();
            console.log(`Updated ${pendingTasks} tasks`);
        },
        {
            scheduled: true,
            timezone: 'South Africa/Johannesburg'
        }
    );
    task.start();
    console.log('Task Scheduler started');
}
