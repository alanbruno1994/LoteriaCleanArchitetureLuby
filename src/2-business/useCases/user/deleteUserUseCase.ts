import { IOutputDeleteUserDto } from '@business/dto/user/delete'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IInputDeleteUser, IUserRepository, IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteUserUseCase
implements IAbstractUseCase<IInputDeleteUser, IOutputDeleteUserDto> {
  constructor (
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository
  ) {}

  async exec (input: IInputDeleteUser): Promise<IOutputDeleteUserDto> {
    const userToDelete = await this.userRepository.delete({
      key: input.key,
      value: input.value
    })
    if (userToDelete == null) {
      return left(UserErrors.userFailedToDelete())
    }

    return right(userToDelete)
  }
}
