import {PgDatabase, PgSelectBase, PgSelectWithout, PgTable} from "drizzle-orm/pg-core";
import {Redis} from "./redis";

export class Repository<Table extends PgTable> {
    constructor(
        private readonly _db: PgDatabase<any>,
        private readonly _table: Table,
        private readonly _redis: Redis
    ) {
    }

    get db() {
        return this._db
    }

    get table() {
        return this._table
    }

    get redis() {
        return this._redis
    }

    async selectWithCache<T>(key: string, expiresIn: number, sql: PgSelectWithout<PgSelectBase<any, any, "single">, false, "where">): Promise<T | null> {
        const cache = await this.redis.get(key)

        if (cache)
            return JSON.parse(cache)

        const result = await sql

        if (!result || !result.length || result.length === 0)
            return null

        await this.redis.set(key, JSON.stringify(result), expiresIn)

        return result as T
    }
}