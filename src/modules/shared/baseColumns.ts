import {serial, timestamp, varchar} from "drizzle-orm/pg-core";

export const baseColumns = {
    id: serial('id').primaryKey(),
    pid: varchar('pid', {length: 191})
        .notNull()
        .$defaultFn(() => crypto.randomUUID()),
    createdAt: timestamp('created_at', {mode: "date"})
        .notNull()
        .defaultNow(),
};