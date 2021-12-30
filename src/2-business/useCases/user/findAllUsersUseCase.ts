/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputFindAllUserDto } from '@business/dto/user/findAll'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IUserRepository, IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllUsersUseCase
implements IAbstractUseCase<void, IOutputFindAllUserDto> {
  constructor (
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository
  ) {}

  async exec (): Promise<IOutputFindAllUserDto> {
    const users = await this.userRepository.findAll()

    if (!users) {
      return left(UserErrors.userNotLoadedCorrectly())
    }

    return right(users)
  }
}
