import {NextFunction, Response} from "express";
import {getClientIp} from "request-ip";
import {HttpError} from "../../../../../core/errors";
import {redisClient} from "../../../../../infra/database/redis";
import {maxRequestsPerMinute, redisRateLimitKeyPrefix} from "./constants";
import {DecodedExpressRequest} from "../../../../../types/decodedExpressRequest";


export async function userRateLimitMiddleware(req: DecodedExpressRequest<null, null>, res: Response, next: NextFunction) {
    const ip: string | null = getClientIp(req)

    if (!ip)
        throw new HttpError(401, "Could not get client IP")

    const key = `${redisRateLimitKeyPrefix}:${ip}`

    const result = parseInt(await redisClient.get(key))

    if (!result) {
        await redisClient.set(key, 1, 60)
        return next()
    }

    if (result >= maxRequestsPerMinute)
        throw new HttpError(429, "Rate limit exceeded")

    await redisClient.set(key, result + 1, 60)

    next()
}