import { IOutputDeleteAccessProfileDto } from '@business/dto/access/delete'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IAccessProfileRepository, IAccessProfileRepositoryToken, IInputDeleteAccess } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteAccessProfileUseCase
implements IAbstractUseCase<IInputDeleteAccess, IOutputDeleteAccessProfileDto> {
  constructor (
    @inject(IAccessProfileRepositoryToken) private readonly accessRepository: IAccessProfileRepository
  ) {}

  async exec (input: IInputDeleteAccess): Promise<IOutputDeleteAccessProfileDto> {
    const accessToDelete = await this.accessRepository.delete({
      key: input.key,
      value: input.value
    })
    if (accessToDelete == null) {
      return left(AccessProfileErrors.accessProfileFailedToDelete())
    }

    return right(accessToDelete)
  }
}
