import {pgTable, serial, varchar} from 'drizzle-orm/pg-core'
import {baseColumns} from "../shared/baseColumns";
import {userTable} from "../user/user.table";

export const sessionTable = pgTable('sessions', {
    ...baseColumns,
    token: varchar('token', {length: 191}).notNull(),
    status: varchar('status', {length: 191}).notNull(),
    name: varchar('name', {length: 191}).notNull(),
    ownerId: serial('owner_id').notNull().references(() => userTable.id),
})