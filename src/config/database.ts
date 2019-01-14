import { createConnection } from 'typeorm';

export const connectToDatabase = async () => await createConnection();
