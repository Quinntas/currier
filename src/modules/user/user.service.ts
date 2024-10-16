import {InsertUserModel} from "./user.model";
import {UserRepo} from "./user.repo";
import {Cryptography} from "../../utils/crypto";
import {env} from "../../utils/env";
import {Redis} from "../shared/redis";
import {JWT} from "../../utils/jwt";

export class UserService {
    constructor(
        private readonly usersRepo: UserRepo,
        private readonly redis: Redis
    ) {
    }

    create(session: InsertUserModel) {
        const password = Cryptography.encrypt(session.password, env.PEPPER)

        return this.usersRepo.create({
            ...session,
            password
        })
    }

    async validateToken(token: string) {
        const key = `user:token:${token}`

        const cache = await this.redis.get(key)

        if (!cache)
            throw new Error('Invalid token')

        const decoded = JWT.decode<{ email: string }>(cache, env.JWT_SECRET)

        return await this.usersRepo.findByEmail(decoded.email)
    }

    async login(email: string, password: string) {
        const user = await this.usersRepo.findByEmail(email)

        if (!user)
            throw new Error('User not found')

        const parsedPass = Cryptography.parseEncryptedData(user.password)
        const encryptedPassword = Cryptography.encrypt(password, env.PEPPER, parsedPass.iterations, parsedPass.salt)
        const comparison = Cryptography.compareString(encryptedPassword, user.password)

        if (!comparison)
            throw new Error('Invalid password')

        const expiresIn = 3600
        const expireDate = new Date(Date.now() + expiresIn * 1000).toISOString()

        const token = JWT.sign({email: user.email}, env.JWT_SECRET, {
            expiresIn
        })

        await this.redis.set(`user:token:${token}`, token, expiresIn)

        return {
            token,
            expiresIn,
            expireDate
        }
    }
}