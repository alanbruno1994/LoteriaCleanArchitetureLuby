/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IInputFindAllUserDto, IOutputFindAllUserDto } from '@business/dto/user/findAll'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IUserRepository, IUserRepositoryToken } from '@business/repositories/user/iUserRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class FindAllUsersUseCase
implements IAbstractUseCase<IInputFindAllUserDto, IOutputFindAllUserDto> {
  constructor (
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository
  ) {}

  async exec (input: IInputFindAllUserDto): Promise<IOutputFindAllUserDto> {
    const users = input.all
      ? await this.userRepository.findAll([
        { tableName: 'access_profiles', currentTableColumn: 'access_profile_id' , foreignJoinColumn: 'access_profiles.id' },
        { tableName: 'bets', currentTableColumn: 'id' , foreignJoinColumn: 'bets.id' }
      ])
      : await this.userRepository.findAll()

    if (!users) {
      return left(UserErrors.userNotLoadedCorrectly())
    }

    return right(users)
  }
}
