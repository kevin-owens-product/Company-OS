import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/company_os';
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const NODE_ENV = process.env.NODE_ENV || 'development';
