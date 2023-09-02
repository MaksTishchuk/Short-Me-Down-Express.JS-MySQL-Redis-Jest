const dotenv = require('dotenv')
import {logger} from './logger/loggerConfig'

dotenv.config()

const getEnvVariable = (key: string) => {
  const value = process.env[key]
  if (!value) {
    const error = `Environment variable "${key}" not specified!`
    logger.error(error)
    throw new Error(error)
  }
  return value
}

const config = {
  SERVER: {
    PORT: getEnvVariable('PORT'),
    BASE_URL: getEnvVariable('BASE_URL'),
  },
  DB: {
    HOST: getEnvVariable('DB_HOST'),
    PORT: getEnvVariable('DB_PORT'),
    DATABASE: getEnvVariable('DB_NAME'),
    USER: getEnvVariable('DB_USER'),
    PASSWORD: getEnvVariable('DB_PASSWORD'),
  },
  REDIS: {
    HOST: getEnvVariable('REDIS_HOST'),
    PORT: getEnvVariable('REDIS_PORT'),
    PASSWORD: getEnvVariable('REDIS_PASSWORD'),
  }
};

export default config