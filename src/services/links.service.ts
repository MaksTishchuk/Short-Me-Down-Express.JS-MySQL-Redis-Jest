import { Service } from 'typedi'
import short from 'short-uuid'
import { DB } from '../config/db/dbConfig'
import { GetFullLinkDto, GetShortLinkDto } from '../dtos/links.dto'
import { HttpException } from '../exceptions/httpException'
import { ILink } from '../interfaces/link.interface'
import { PaginationDto } from '../dtos/pagination.dto'
import { getPagination } from '../utils/pagination'
import config from '../config/config'
import { IDeleteResponse } from '../interfaces/delete-response.interface'
import { redisClient } from './redis.service'
import Redis from 'ioredis'
import {logger} from '../config/logger/loggerConfig'

@Service()
export class LinksService {

  private redisClient: Redis = redisClient

  public async generateOrReturnShortLink(dto: GetShortLinkDto): Promise<ILink> {
    const getLinkFromRedis = await this.redisClient.get(dto.fullUrl)
    if (getLinkFromRedis) return JSON.parse(getLinkFromRedis)
    const existsLink: ILink | null = await DB.Links.findOne({ where: { fullUrl: dto.fullUrl } })
    if (!existsLink) {
      const token = short.generate()
      const baseUrl = config.SERVER.BASE_URL
      const shortUrl = baseUrl + '/to/' + token
      const createdLink: ILink = await DB.Links.create({
        fullUrl: dto.fullUrl, shortUrl, token,
      })
      await this.redisClient.setex(createdLink.fullUrl, 1800, JSON.stringify(createdLink))
      return createdLink
    }
    await this.redisClient.setex(existsLink.fullUrl, 1800, JSON.stringify(existsLink))
    return existsLink
  }

  public async redirectToUrl(token: string): Promise<string> {
    const existsLink: ILink | null = await DB.Links.findOne({ where: { token } })
    if (!existsLink) throw new HttpException(404, 'Link was not found!')
    return existsLink.fullUrl
  }

  public async getFullLink(dto: GetFullLinkDto): Promise<ILink> {
    const existsLink: ILink | null = await DB.Links.findOne({ where: { shortUrl: dto.shortUrl } })
    if (!existsLink) throw new HttpException(404, 'Link was not found!')
    return existsLink
  }

  public async findAllLinks(dto: PaginationDto): Promise<ILink[]> {
    const { perPage, skip } = getPagination(dto)
    return await DB.Links.findAll({ limit: perPage, offset: skip })
  }

  public async findLinkById(id: number): Promise<ILink> {
    const link: ILink | null = await DB.Links.findByPk(id)
    if (!link) throw new HttpException(404, 'Link was not found!')
    return link
  }

  public async deleteLink(id: number): Promise<IDeleteResponse> {
    const foundLink = await this.findLinkById(id)
    await DB.Links.destroy({ where: { id } })
    await this.redisClient.del(foundLink.fullUrl)
    return { success: true, message: 'Link has been deleted!' }
  }

  public async deleteAllLinks(): Promise<IDeleteResponse> {
    await DB.Links.truncate()
    const targetDatabase = 0
    await this.redisClient.select(targetDatabase, async () => {
      await this.redisClient.flushdb()
        .then(() => {
          logger.info(`Redis database with number ${targetDatabase} has been cleared!`)
        })
        .catch((error) => {
          logger.error(`Redis database with number ${targetDatabase} has not been cleared: ${error}`)
        })
    })
    return { success: true, message: 'Link has been deleted!' }
  }
}