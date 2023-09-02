import { Router } from 'express'
import { LinksController } from '../controllers/links.controller'
import { IRoutes } from '../interfaces/routes.interface'

export class RedirectRoute implements IRoutes {
  public path = '/to'
  public router = Router()
  public linksController = new LinksController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:token`, this.linksController.redirectToUrl)
  }

}