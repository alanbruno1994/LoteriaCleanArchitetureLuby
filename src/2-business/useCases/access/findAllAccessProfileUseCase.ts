/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IInputFindAllAccessProfileDto, IOutputFindAllAccessProfileDto } from '@business/dto/access/findAll'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IAccessProfileRepository, IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllAccessProfileUseCase
implements IAbstractUseCase<IInputFindAllAccessProfileDto, IOutputFindAllAccessProfileDto> {
  constructor (
    @inject(IAccessProfileRepositoryToken) private readonly accessRepository: IAccessProfileRepository
  ) {}

  async exec (input: IInputFindAllAccessProfileDto): Promise<IOutputFindAllAccessProfileDto> {
    const access = input.all ? await this.accessRepository.findAll([{ tableName: 'users', currentTableColumn: 'id' , foreignJoinColumn: 'users.user_id' }]) : await this.accessRepository.findAll()

    if (!access) {
      return left(AccessProfileErrors.accessProfileNotLoadedCorrectly())
    }

    return right(access)
  }
}
