import { User, UserWithId, Users } from '../model/users.model';
import { ObjectId } from 'mongodb';

export class UserService {
    private static instance: UserService;

    private constructor() {}

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }

    private readonly users = Users;

    async getAllUsers(): Promise<UserWithId[]> {
        return this.users.find().toArray();
    }

    async getUserById(id: string): Promise<UserWithId | null> {
        return this.users.findOne({ _id: new ObjectId(id) });
    }

    async createUser(user: User): Promise<UserWithId> {
        const result = await this.users.insertOne(user);
        return {
            _id: result.insertedId,
            ...user
        };
    }

    async updateUser(id: string, user: User): Promise<UserWithId | null> {
        const result = await this.users.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: user }, { returnDocument: 'after' });
        return result.value;
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await this.users.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount === 1;
    }
}
