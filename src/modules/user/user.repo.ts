import {PgDatabase} from "drizzle-orm/pg-core";
import {InsertUserModel, SelectUserModel} from "./user.model";
import {eq} from "drizzle-orm";
import {userTable} from "./user.table";
import {Redis} from "../shared/redis";

export class UserRepo {
    constructor(
        private readonly db: PgDatabase<any>,
        private readonly table: typeof userTable,
        private readonly redis: Redis
    ) {
    }

    async findByEmail(email: string): Promise<SelectUserModel> {
        const key = `user:email:${email}`

        const cache = await this.redis.get(key)

        if (cache)
            return JSON.parse(cache) as SelectUserModel

        const [user] = await this.db.select().from(this.table).where(eq(this.table.email, email))

        if (!user)
            throw new Error('User not found')

        await this.redis.set(key, JSON.stringify(user), 3600)

        return user
    }

    create(session: InsertUserModel) {
        return this.db.insert(this.table).values(session).returning();
    }
}