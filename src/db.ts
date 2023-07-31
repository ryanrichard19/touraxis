import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = process.env.MONGO_PASSWORD || 'mongodb://localhost:27017/touraxis';


export const client = new MongoClient(MONGO_URL);
export const db = client.db();
