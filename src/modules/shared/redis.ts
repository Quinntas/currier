import {createClient, RedisClientType} from "redis";

export class Redis {
    private readonly client: RedisClientType;

    constructor(url: string) {
        this.client = createClient({
            url
        });
    }

    async connect() {
        await this.client.connect()
    }

    get(key: string) {
        return this.client.get(key);
    }

    set(key: string, value: string, expiresIn: number = 3600) {
        return this.client.set(key, value, {
            EX: expiresIn,
        });
    }
}