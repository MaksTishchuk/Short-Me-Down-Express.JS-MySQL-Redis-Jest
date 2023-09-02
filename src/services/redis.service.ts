const Redis = require('ioredis')
import { redisConfig } from '../config/redis/redisConfig'
import {logger} from '../config/logger/loggerConfig'

const redisClient = new Redis(redisConfig)

redisClient.on('connect', () => {
  logger.info('Redis connection established successfully!')
})
redisClient.on('error', (err: Error) => {
  logger.error('Redis connection failed:', err)
})

export {redisClient}