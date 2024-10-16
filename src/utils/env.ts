import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
    DATABASE_URL: process.env.DATABASE_URL!,
    JWT_SECRET: process.env.JWT_SECRET!,
    PORT: process.env.PORT!,
    REDIS_URL: process.env.REDIS_URL!,
    PEPPER: process.env.PEPPER!,
}