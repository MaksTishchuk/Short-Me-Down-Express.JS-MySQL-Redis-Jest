import request from 'supertest'
import { App } from '../app'
import { GetFullLinkDto, GetShortLinkDto } from '../dtos/links.dto'
import { LinksRoute } from '../routes/links.route'
import { defaultUrl, mockDeleteResponse, mockLinks } from './constants'
import { RedirectRoute } from '../routes/redirect.route'
import { HttpException } from '../exceptions/httpException'

jest.mock('../services/redis.service', () => {
  return { redisClient: jest.fn() }
})

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500))
})

describe('Testing Links', () => {

  describe('[POST] /links', () => {
    it('response generated object with short link', async () => {
      const linksRoute = new LinksRoute()
      const linksService = linksRoute.linksController.linksService
      linksService.generateOrReturnShortLink = jest.fn().mockReturnValue(mockLinks[0])
      const app = new App([linksRoute])
      const sendData: GetShortLinkDto = { fullUrl: mockLinks[0].fullUrl }
      const response = await request(app.getServer()).post(`${defaultUrl}${linksRoute.path}`).send(sendData)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ data: mockLinks[0], message: 'generateOrReturnShortLink' })
      expect(linksService.generateOrReturnShortLink).toHaveBeenCalled()
      expect(linksService.generateOrReturnShortLink).toHaveBeenCalledTimes(1)
      expect(linksService.generateOrReturnShortLink).toHaveBeenCalledWith(sendData)
    })

    it('response error with 400 code with require fullUrl in body', async () => {
      const linksRoute = new LinksRoute()
      const linksService = linksRoute.linksController.linksService
      linksService.generateOrReturnShortLink = jest.fn()
      const app = new App([linksRoute])
      const response = await request(app.getServer()).post(`${defaultUrl}${linksRoute.path}`)
      expect(response.status).toBe(400)
      expect(linksService.generateOrReturnShortLink).toHaveBeenCalledTimes(0)
    })
  })

  describe('[POST] /links/get-full-link', () => {
    it('response return object with full link', async () => {
      const linksRoute = new LinksRoute()
      const linksService = linksRoute.linksController.linksService
      linksService.getFullLink = jest.fn().mockReturnValue(mockLinks[0])
      const app = new App([linksRoute])
      const sendData: GetFullLinkDto = { shortUrl: mockLinks[0].shortUrl }
      const response = await request(app.getServer()).post(`${defaultUrl}${linksRoute.path}/get-full-link`).send(sendData)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ data: mockLinks[0], message: 'getFullLink' })
      expect(linksService.getFullLink).toHaveBeenCalled()
      expect(linksService.getFullLink).toHaveBeenCalledTimes(1)
      expect(linksService.getFullLink).toHaveBeenCalledWith(sendData)
    })

    it('response error with 400 code with require shortUrl in body', async () => {
      const linksRoute = new LinksRoute()
      const linksService = linksRoute.linksController.linksService
      linksService.getFullLink = jest.fn()
      const app = new App([linksRoute])
      const response = await request(app.getServer()).post(`${defaultUrl}${linksRoute.path}/get-full-link`)
      expect(response.status).toBe(400)
      expect(linksService.getFullLink).toHaveBeenCalledTimes(0)
    })

    it('response get full link error', async () => {
      const linksRoute = new LinksRoute()
      const linksService = linksRoute.linksController.linksService
      linksService.getFullLink = jest.fn(() => {
        throw new HttpException(404, 'Link was not found!')
      })
      const app = new App([linksRoute])
      const sendData: GetFullLinkDto = { shortUrl: mockLinks[0].shortUrl }
      const response = await request(app.getServer()).post(`${defaultUrl}${linksRoute.path}/get-full-link`).send(sendData)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Link was not found!' })
      expect(linksService.getFullLink).toHaveBeenCalledTimes(1)
    })
  })

  describe('[GET] /links', () => {
    it('response find All links', async () => {
      const linksRoute = new LinksRoute()
      const linksService = linksRoute.linksController.linksService
      linksService.findAllLinks = jest.fn().mockReturnValue(mockLinks)
      const app = new App([linksRoute])
      const response = await request(app.getServer()).get(`${defaultUrl}${linksRoute.path}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ data: mockLinks, message: 'findAllLinks' })
      expect(linksService.findAllLinks).toHaveBeenCalled()
      expect(linksService.findAllLinks).toHaveBeenCalledTimes(1)
    })
  })

  describe('[GET] /links/:id', () => {
    it('response find link by id', async () => {
      const linkId = 1
      const linksRoute = new LinksRoute()
      const linksService = linksRoute.linksController.linksService
      linksService.findLinkById = jest.fn().mockReturnValue(mockLinks[0])
      const app = new App([linksRoute])
      const response = await request(app.getServer()).get(`${defaultUrl}${linksRoute.path}/${linkId}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ data: mockLinks[0], message: 'findLinkById' })
      expect(linksService.findLinkById).toHaveBeenCalled()
      expect(linksService.findLinkById).toHaveBeenCalledTimes(1)
      expect(linksService.findLinkById).toHaveBeenCalledWith(linkId)
    })

    it('response find link by id error', async () => {
      const linkId = 1
      const linksRoute = new LinksRoute()
      const linksService = linksRoute.linksController.linksService
      linksService.findLinkById = jest.fn(() => {
        throw new HttpException(404, 'Link was not found!')
      })
      const app = new App([linksRoute])
      const response = await request(app.getServer()).get(`${defaultUrl}${linksRoute.path}/${linkId}`)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Link was not found!' })
    })
  })

  describe('[DELETE] /links/:id', () => {
    it('response delete link by id', async () => {
      const linkId = 1
      const linksRoute = new LinksRoute()
      const linksService = linksRoute.linksController.linksService
      linksService.deleteLink = jest.fn().mockReturnValue(mockDeleteResponse)
      const app = new App([linksRoute])
      const response = await request(app.getServer()).delete(`${defaultUrl}${linksRoute.path}/${linkId}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ data: mockDeleteResponse, message: 'deleteLink' })
      expect(linksService.deleteLink).toHaveBeenCalled()
      expect(linksService.deleteLink).toHaveBeenCalledTimes(1)
      expect(linksService.deleteLink).toHaveBeenCalledWith(linkId)
    })

    it('response delete link by id error', async () => {
      const linkId = 1
      const linksRoute = new LinksRoute()
      const linksService = linksRoute.linksController.linksService
      linksService.deleteLink = jest.fn(() => {
        throw new HttpException(404, 'Link was not found!')
      })
      const app = new App([linksRoute])
      const response = await request(app.getServer()).delete(`${defaultUrl}${linksRoute.path}/${linkId}`)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Link was not found!' })
    })
  })

})

describe('Testing Redirect Links', () => {
  describe('[GET] /to/:token', () => {
    it('response find link by token and redirect to full url', async () => {
      const token = mockLinks[0].token
      const redirectRoute = new RedirectRoute()
      const linksService = redirectRoute.linksController.linksService
      linksService.redirectToUrl = jest.fn().mockReturnValue(mockLinks[0].fullUrl)
      const app = new App([redirectRoute])
      const response = await request(app.getServer()).get(`${redirectRoute.path}/${token}`)
      expect(response.status).toBe(302)
      expect(linksService.redirectToUrl).toHaveBeenCalled()
      expect(linksService.redirectToUrl).toHaveBeenCalledTimes(1)
      expect(linksService.redirectToUrl).toHaveBeenCalledWith(token)
    })

    it('response redirect error', async () => {
      const token = mockLinks[0].token
      const redirectRoute = new RedirectRoute()
      const linksService = redirectRoute.linksController.linksService
      linksService.redirectToUrl = jest.fn(() => {
        throw new HttpException(404, 'Link was not found!')
      })
      const app = new App([redirectRoute])
      const response = await request(app.getServer()).get(`${redirectRoute.path}/${token}`)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ message: 'Link was not found!' })
      expect(linksService.redirectToUrl).toHaveBeenCalledTimes(1)
    })
  })
})
