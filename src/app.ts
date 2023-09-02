import 'reflect-metadata'
import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import hpp from 'hpp'
import morgan from 'morgan'
import { DB } from './config/db/dbConfig'
import { IRoutes } from './interfaces/routes.interface'
import { ErrorMiddleware } from './middlewares/error.middleware'
import {logger} from './config/logger/loggerConfig'

const cors = require('cors')
const helmet = require('helmet')

export class App {
  public app: express.Application
  public port: string | number

  constructor(routes: IRoutes[]) {
    this.app = express()
    this.port = Number(process.env.PORT) || 3000

    this.initializeMiddlewares()
    this.initializeRoutes(routes)
    this.initializeErrorHandling()
  }

  public async listen() {
    await this.connectToDatabase()
    this.app.listen(this.port, () => {
      logger.info(`=================================`)
      logger.info(`🚀 App listening on port ${this.port}!`)
      logger.info(`=================================`)
    })
  }

  public getServer() {
    return this.app
  }

  private async connectToDatabase() {
    try {
      await DB.sequelize.sync({ alter: true })
      logger.info('Database connection established successfully!')
    } catch (error) {
      logger.error('Database connection failed:', error)
      process.exit(1)
    }
  }

  private initializeMiddlewares() {
    this.app.use(morgan('dev'))
    this.app.use(cors())
    this.app.options('*', cors)
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.urlencoded({ limit: '10mb', extended: true }))
    this.app.use(bodyParser.json({ limit: '10mb' }))
  }

  private initializeRoutes(routes: IRoutes[]) {
    routes.forEach(route => {
      if (route.path != '/to') this.app.use('/api/v1', route.router)
      else this.app.use('', route.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware)
  }
}