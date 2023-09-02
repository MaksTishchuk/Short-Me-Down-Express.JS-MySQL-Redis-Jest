import { NextFunction, Request, Response } from 'express'
import { Container } from 'typedi'
import { LinksService } from '../services/links.service'
import { ILink } from '../interfaces/link.interface'
import { PaginationDto } from '../dtos/pagination.dto'
import { GetFullLinkDto, GetShortLinkDto } from '../dtos/links.dto'
import { IDeleteResponse } from '../interfaces/delete-response.interface'

export class LinksController {
  public linksService = Container.get(LinksService)

  public generateOrReturnShortLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getShortLinkDto: GetShortLinkDto = req.body
      const shortLink: ILink = await this.linksService.generateOrReturnShortLink(getShortLinkDto)
      res.status(200).json({ data: shortLink, message: 'generateOrReturnShortLink' })
    } catch (error) {
      next(error)
    }
  }

  public getFullLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const getFullLinkDto: GetFullLinkDto = req.body
      const fullLink: ILink = await this.linksService.getFullLink(getFullLinkDto)
      res.status(200).json({ data: fullLink, message: 'getFullLink' })
    } catch (error) {
      next(error)
    }
  }

  public redirectToUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string = req.params.token
      const fullUrl: string = await this.linksService.redirectToUrl(token)
      res.redirect(fullUrl)
    } catch (error) {
      next(error)
    }
  }

  public findAllLinks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paginationDto: PaginationDto = req.query
      const findAllLinksData: ILink[] = await this.linksService.findAllLinks(paginationDto)
      res.status(200).json({ data: findAllLinksData, message: 'findAllLinks' })
    } catch (error) {
      next(error)
    }
  }

  public findLinkById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const linkId: number = Number(req.params.id)
      const findOneLink: ILink = await this.linksService.findLinkById(linkId)
      res.status(200).json({ data: findOneLink, message: 'findLinkById' })
    } catch (error) {
      next(error)
    }
  }

  public deleteLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const linkId: number = Number(req.params.id)
      const deleteLink: IDeleteResponse = await this.linksService.deleteLink(linkId)
      res.status(200).json({ data: deleteLink, message: 'deleteLink' })
    } catch (error) {
      next(error)
    }
  }

  public deleteAllLinks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteAllLinks: IDeleteResponse = await this.linksService.deleteAllLinks()
      res.status(200).json({ data: deleteAllLinks, message: 'deleteAllLinks' })
    } catch (error) {
      next(error)
    }
  }

}