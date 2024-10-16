import {PgDatabase} from "drizzle-orm/pg-core";
import {InsertUserModel, SelectUserModel} from "./user.model";
import {eq} from "drizzle-orm";
import {userTable} from "./user.table";
import {Redis} from "../shared/redis";
import {Repository} from "../shared/repository";

export class UserRepo extends Repository<typeof userTable> {
    constructor(
        db: PgDatabase<any>,
        table: typeof userTable,
        redis: Redis
    ) {
        super(db, table, redis)
    }

    async findByEmail(email: string) {
        const user = await this.selectWithCache<SelectUserModel[]>(
            `user:email:${email}`,
            3600,
            this.db.select().from(this.table).where(eq(this.table.email, email))
        )
        if (!user)
            throw new Error('User not found')
        return user[0]
    }

    create(session: InsertUserModel) {
        return this.db.insert(this.table).values(session).returning();
    }
}