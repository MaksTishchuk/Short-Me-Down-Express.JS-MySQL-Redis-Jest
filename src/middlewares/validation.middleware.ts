import { plainToInstance } from 'class-transformer'
import { validateOrReject, ValidationError } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { HttpException } from '../exceptions/httpException'

export const ValidationMiddleware = (
  type: any, typeDto: 'body' | 'query', skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req[typeDto])
    validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted })
      .then(() => {
        req[typeDto] = dto
        next()
      })
      .catch((errors: ValidationError[]) => {
        // @ts-ignore
        const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ')
        next(new HttpException(400, message))
      })
  }
}