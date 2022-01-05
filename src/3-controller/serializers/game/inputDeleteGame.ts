import { IInputDeleteGameDto } from '@business/dto/game/delete'
import { IsString } from 'class-validator'
import { AbstractSerializer } from '../abstractSerializer'

export class InputDeleteGame extends AbstractSerializer<IInputDeleteGameDto> {
  @IsString()
  secure_id!: string
}
