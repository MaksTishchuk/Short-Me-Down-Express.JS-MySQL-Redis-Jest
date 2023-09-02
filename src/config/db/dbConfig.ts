import { Sequelize, Dialect, Options } from 'sequelize'
import config from '../config'
import LinkModel from '../../models/link.model'

const dialect: Dialect = 'mysql'

const sequelizeOptions: Options = {
  dialect: dialect,
  host: config.DB.HOST,
  port: parseInt(config.DB.PORT),
  timezone: '+03:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    max: 5,
    min: 0,
  },
  logging: false
}

const sequelize = new Sequelize(
  config.DB.DATABASE,
  config.DB.USER,
  config.DB.PASSWORD,
  sequelizeOptions
)

sequelize.authenticate()

export const DB = {
  Links: LinkModel(sequelize),
  sequelize,
  Sequelize
}