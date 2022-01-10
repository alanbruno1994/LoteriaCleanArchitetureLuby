import { inject, injectable } from 'inversify'
import { left, right } from '@shared/either'
import { IAbstractUseCase } from '../abstractUseCase'
import { IAccessProfileRepository, IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { IInputAuthorizeAccessProfileDto, IOutputAuthorizeAccessProfileDto } from '@business/dto/access/authorize'
import { IUserRepository, IUserRepositoryToken } from '@business/repositories/user/iUserRepository'

@injectable() // Aqui indica que a classe faz parte das injecoes dinamicas
export class AuthorizeAccessProfileUseCase
implements IAbstractUseCase<IInputAuthorizeAccessProfileDto, IOutputAuthorizeAccessProfileDto> {
  // @inject e usado para faz as injecoes dinamicas, ou seja, em tempo de
  // execucao.
  constructor (
    @inject(IAccessProfileRepositoryToken) private readonly accessRepository: IAccessProfileRepository,
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository
  ) {}

  async exec (input: IInputAuthorizeAccessProfileDto): Promise<IOutputAuthorizeAccessProfileDto> {
    const user = await this.userRepository.findBy('id',input.id)
    if (!user) {
      return left(AccessProfileErrors.notAuthorzieAccessProfileNotUserFound())
    }
    const access = await this.accessRepository.findBy('id', user.access_profile_id)
    if (!access) {
      return left(AccessProfileErrors.accessProfileNotFound())
    }
    if (access.level !== 'admin') {
      return left(AccessProfileErrors.notAuthorzieAccessProfile())
    }

    return right(void 0)
  }
}
