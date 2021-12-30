/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputFindAllAccessProfileDto } from '@business/dto/access/findAll'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IAccessProfileRepository, IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllAccessProfileUseCase
implements IAbstractUseCase<void, IOutputFindAllAccessProfileDto> {
  constructor (
    @inject(IAccessProfileRepositoryToken) private readonly accessRepository: IAccessProfileRepository
  ) {}

  async exec (): Promise<IOutputFindAllAccessProfileDto> {
    const access = await this.accessRepository.findAll()

    if (!access) {
      return left(AccessProfileErrors.accessProfileNotLoadedCorrectly())
    }

    return right(access)
  }
}
