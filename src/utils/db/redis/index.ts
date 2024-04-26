import { RedisController } from "./redisController";

export const redis = new RedisController(process.env['REDIS'] ?? '')