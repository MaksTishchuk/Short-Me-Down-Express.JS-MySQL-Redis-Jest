import { Router } from 'express'
import { LinksController } from '../controllers/links.controller'
import { IRoutes } from '../interfaces/routes.interface'
import { ValidationMiddleware } from '../middlewares/validation.middleware'
import { PaginationDto } from '../dtos/pagination.dto'
import { GetFullLinkDto, GetShortLinkDto } from '../dtos/links.dto'

export class LinksRoute implements IRoutes {
  public path = '/links'
  public router = Router()
  public linksController = new LinksController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      ValidationMiddleware(GetShortLinkDto, 'body'),
      this.linksController.generateOrReturnShortLink
    )
    this.router.post(
      `${this.path}/get-full-link`,
      ValidationMiddleware(GetFullLinkDto, 'body'),
      this.linksController.getFullLink
    )
    this.router.get(
      `${this.path}`,
      ValidationMiddleware(PaginationDto, 'query'),
      this.linksController.findAllLinks
    )
    this.router.get(`${this.path}/:id`, this.linksController.findLinkById)
    this.router.delete(`${this.path}/delete-all-links`, this.linksController.deleteAllLinks)
    this.router.delete(`${this.path}/:id`, this.linksController.deleteLink)
  }

}