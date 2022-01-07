/* eslint-disable no-void */
import { IInputFindAccessProfileByDto, IOutputFindAccessProfileByDto } from '@business/dto/access/findBy'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IAccessProfileRepository, IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAccessProfileByUseCase
implements IAbstractUseCase<IInputFindAccessProfileByDto, IOutputFindAccessProfileByDto> {
  constructor (
    @inject(IAccessProfileRepositoryToken) private readonly accessRepository: IAccessProfileRepository
  ) {}

  async exec (input: IInputFindAccessProfileByDto): Promise<IOutputFindAccessProfileByDto> {
    const access = await this.accessRepository.findBy(input.key, input.value)
    if (!access) {
      return left(AccessProfileErrors.accessProfileNotFound())
    }

    return right(access)
  }
}
