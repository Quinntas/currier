import {Redis} from "./redis";
import {env} from "../../utils/env";

export const redis = new Redis(env.REDIS_URL)