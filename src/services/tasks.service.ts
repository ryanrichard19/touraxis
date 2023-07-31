import { Task, TaskDTO, TaskWithId, Tasks } from '../model/tasks.model';
import { ObjectId } from 'mongodb';

export class TaskService {
    private readonly tasks = Tasks;

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
}
