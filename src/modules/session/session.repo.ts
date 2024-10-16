import {PgDatabase, PgTable} from "drizzle-orm/pg-core";
import {InsertSessionModel} from "./session.model";

export class SessionRepo {
    constructor(
        private readonly db: PgDatabase<any>,
        private readonly table: PgTable
    ) {
    }

    create(session: InsertSessionModel) {
        return this.db.insert(this.table).values(session).returning();
    }
}