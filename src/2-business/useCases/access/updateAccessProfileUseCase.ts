/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IWhere } from '@business/repositories/where'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'
import { InputUpdateGameDto } from '@business/dto/game/update'
import { AccessProfileEntityKeys, IAccessProfileRepository, IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { InputUpdateAccessProfileDto, IOutputUpdateAccessProfileDto } from '@business/dto/access/update'
import { AccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'

@injectable()
export class UpdateAccessProfileUseCase
implements IAbstractUseCase<InputUpdateGameDto, IOutputUpdateAccessProfileDto> {
  constructor (
    @inject(IAccessProfileRepositoryToken) private readonly accessRepository: IAccessProfileRepository
  ) {}

  async exec (input: InputUpdateAccessProfileDto,
    updateWhere: IWhere<AccessProfileEntityKeys, string | number>): Promise<IOutputUpdateAccessProfileDto> {
    try {
      const newAccessProfileEntity = AccessProfileEntity.update(input)

      const access = newAccessProfileEntity.value.export()

      const gameUpdate = await this.accessRepository.update({
        newData: {
          level: access.level,
          updated_at: access.updated_at
        },
        updateWhere
      })

      if (!gameUpdate) {
        return left(AccessProfileErrors.accessProfileNotFound())
      }

      return right(newAccessProfileEntity.value.export())
    } catch (error) {
      return left(AccessProfileErrors.accessProfileFailedToUpdate())
    }
  }
}
