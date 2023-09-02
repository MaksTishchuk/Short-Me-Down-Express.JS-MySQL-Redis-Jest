import { Sequelize, Model, DataTypes } from 'sequelize'
import { ILink } from '../interfaces/link.interface'

export class LinkModel extends Model<ILink> implements ILink {
  public id!: number
  public token!: string
  public fullUrl!: string
  public shortUrl!: string
  public createdAt!: Date
}

export default function(sequelize: Sequelize): typeof LinkModel {
  LinkModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fullUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'full_url',
      },
      shortUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'short_url',
      },
    },
    {
      sequelize,
      tableName: 'links',
      timestamps: false,
    },
  )
  return LinkModel
}



