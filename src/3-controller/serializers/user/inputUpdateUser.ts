import { InputUpdateUserDto } from '@business/dto/user/update'
import { IsEmail, IsString, MinLength, IsNumber, IsOptional } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputUpdateUser extends AbstractSerializer<InputUpdateUserDto> {
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @MinLength(15)
  @IsOptional()
  name?: string

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string

  @IsNumber()
  @IsOptional()
  accessProfileId?: number
}
