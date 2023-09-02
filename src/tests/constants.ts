import { ILink } from '../interfaces/link.interface'
import { IDeleteResponse } from '../interfaces/delete-response.interface'

export const defaultUrl = '/api/v1'

export const mockLinks: ILink[] = [
  {
    id: 1,
    token: '1234567',
    fullUrl: 'https://translate.google.com/?hl=ru&sl=ru&tl=en&text=%D0%B0%D0%B0%D1%85%D0%B0%20&op=translate',
    shortUrl: 'http://localhost:3000/to/1234567',
  },
  {
    id: 2,
    token: '1234568',
    fullUrl: 'https://translate.google.com/?hl=ru&sl=ru&tl=en&text=%D0%BF%D0%BE%D1%87%D0%B5%D0%BC%D1%83&op=translate',
    shortUrl: 'http://localhost:3000/to/1234568',
  },
  {
    id: 3,
    token: '1234569',
    fullUrl: 'https://translate.google.com/?hl=ru&sl=ru&tl=en&text=%D0%BF%D0%BE%D1%82%D0%BE%D0%BC%D1%83&op=translate',
    shortUrl: 'http://localhost:3000/to/1234569',
  },
]

export const mockDeleteResponse: IDeleteResponse = {
  success: true,
  message: 'Link has been deleted!'
}