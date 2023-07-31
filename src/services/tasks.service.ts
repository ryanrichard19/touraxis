import Logger from '../library/Logger';
import { Task, TaskDTO, TaskWithId, Tasks } from '../model/tasks.model';
import { ObjectId } from 'mongodb';

export class TaskService {
    private static instance: TaskService;
    private readonly tasks = Tasks;

    private constructor() {}

    public static getInstance(): TaskService {
        if (!TaskService.instance) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    }

    async getAllTasks(userid: string): Promise<TaskWithId[]> {
        return this.tasks.find({ user_id: userid }).toArray();
    }

    async getTaskById(userid: string, id: string): Promise<TaskWithId | null> {
        return this.tasks.findOne({ _id: new ObjectId(id), user_id: userid });
    }

    async createTask(userid: string, taskDTO: TaskDTO): Promise<TaskWithId> {
        const task: Task = {
            ...taskDTO,
            date_time: new Date(taskDTO.date_time) // Convert string to Date here
        };
        const result = await this.tasks.insertOne({ ...task, user_id: userid });
        return {
            _id: result.insertedId,
            ...task,
            user_id: userid
        };
    }

    async updateTask(userid: string, id: string, task: Task): Promise<TaskWithId | null> {
        const result = await this.tasks.findOneAndUpdate({ _id: new ObjectId(id), user_id: userid }, { $set: task }, { returnDocument: 'after' });
        return result.value;
    }

    async deleteTask(userid: string, id: string): Promise<boolean> {
        const result = await this.tasks.deleteOne({ _id: new ObjectId(id), user_id: userid });
        return result.deletedCount === 1;
    }

    async updateStatusPendingTaskstoDone(): Promise<void> {
        const tasksCursor: any = this.tasks.find({
            status: 'pending',
            date_time: { $lt: new Date() }
        });
        const tasks = await tasksCursor.toArray();
        Logger.info(`Found ${tasks.length} tasks to update`);

        for (let task of tasks) {
            task.status = 'done';
            await this.tasks.findOneAndUpdate({ _id: new ObjectId(task._id) }, { $set: task }, { returnDocument: 'after' });
            Logger.info(`Updated task ${task._id} status to done`);
        }
    }
}
