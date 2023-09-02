import { RedisOptions } from 'ioredis'
import config from '../config'

const dotenv = require('dotenv')

dotenv.config()

export const redisConfig: RedisOptions = {
  host: config.REDIS.HOST || '',
  port: parseInt(config.REDIS.PORT || '0'),
  password: config.REDIS.PASSWORD || '',
}