import {pgTable, varchar} from 'drizzle-orm/pg-core'
import {baseColumns} from "../shared/baseColumns";

export const sessionTable = pgTable('sessions', {
    ...baseColumns,
    token: varchar('token', {length: 191}).notNull(),
    status: varchar('status', {length: 191}).notNull(),
    name: varchar('name', {length: 191}).notNull(),
})