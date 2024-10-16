import {PgDatabase} from "drizzle-orm/pg-core";
import {InsertSessionModel, SelectSessionModel} from "./session.model";
import {Redis} from "../shared/redis";
import {Repository} from "../shared/repository";
import {sessionTable} from "./session.table";
import {and, eq} from "drizzle-orm";

export class SessionRepo extends Repository<typeof sessionTable> {
    constructor(
        db: PgDatabase<any>,
        table: typeof sessionTable,
        redis: Redis
    ) {
        super(db, table, redis)
    }

    create(session: InsertSessionModel) {
        return this.db.insert(this.table).values(session).returning();
    }

    async findByTokenAndUserId(token: string, userId: number) {
        const session = await this.selectWithCache<SelectSessionModel[]>(
            `session:token:${token}:userId:${userId}`,
            3600,
            this.db.select().from(this.table).where(and(
                eq(this.table.token, token),
                eq(this.table.ownerId, userId)
            ))
        )
        if (!session)
            throw new Error('Session not found')
        return session[0]
    }

    async findActive() {
        const session = await this.selectWithCache<SelectSessionModel[]>(
            'session:active',
            3600,
            this.db.select().from(this.table).where(eq(this.table.status, "ACTIVE"))
        )
        if (!session)
            throw new Error('Session not found')
        return session
    }
}