import {pgTable, varchar} from 'drizzle-orm/pg-core'
import {baseColumns} from "../shared/baseColumns";

export const userTable = pgTable('users', {
    ...baseColumns,
    name: varchar('name', {length: 191}).notNull(),
    email: varchar('email', {length: 191}).notNull().unique(),
    password: varchar('password', {length: 191}).notNull(),
})