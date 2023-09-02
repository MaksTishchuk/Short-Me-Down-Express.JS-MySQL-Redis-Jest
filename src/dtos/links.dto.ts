import { IsUrl, IsNotEmpty, IsString } from 'class-validator'

export class GetShortLinkDto {
  @IsNotEmpty()
  @IsUrl()
  fullUrl!: string
}

export class GetFullLinkDto {
  @IsNotEmpty()
  @IsString()
  shortUrl!: string
}