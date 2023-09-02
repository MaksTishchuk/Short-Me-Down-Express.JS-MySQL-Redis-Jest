import { RedisOptions } from 'ioredis'
import dotenv from 'dotenv'
import config from '../config'

dotenv.config()

export const redisConfig: RedisOptions = {
  host: config.REDIS.HOST || '',
  port: parseInt(config.REDIS.PORT || '0'),
  password: config.REDIS.PASSWORD || '',
}