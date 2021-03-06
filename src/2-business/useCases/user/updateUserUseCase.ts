/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  InputUpdateUserDto,
  IOutputUpdateUserDto
} from '@business/dto/user/update'

import { IWhere } from '@business/repositories/where'
import {
  IUserRepository,
  IUserRepositoryToken,
  UserEntityKeys
} from '@business/repositories/user/iUserRepository'
import {
  IHasherService,
  IHasherServiceToken
} from '@business/services/hasher/iHasher'
import { UserEntity } from '@domain/entities/userEntity'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'
import { UserErrors } from '@business/modules/errors/user/userErrors'

@injectable()
export class UpdateUserUseCase
implements IAbstractUseCase<InputUpdateUserDto, IOutputUpdateUserDto> {
  constructor (
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @inject(IHasherServiceToken) private readonly hasherService: IHasherService
  ) {}

  async exec (input: InputUpdateUserDto,
    updateWhere: IWhere<UserEntityKeys, string | number>): Promise<IOutputUpdateUserDto> {
    try {
      const newUserEntity = UserEntity.update(input)

      const user = newUserEntity.value.export()

      const userPassword = user.password
        ? await this.hasherService.create(user.password)
        : undefined

      const userUpdate = await this.userRepository.update({
        newData: {
          email: user.email,
          access_profile_id: user.access_profile_id,
          name: user.name,
          password: userPassword,
          token_recover_password: user.token_recover_password,
          token_recover_password_expire_date: user.token_recover_password_expire_date,
          updated_at: user.updated_at
        },
        updateWhere
      })

      if (!userUpdate) {
        return left(UserErrors.userNotFound())
      }

      return right(newUserEntity.value.export())
    } catch (error) {
      return left(UserErrors.userFailedToUpdate())
    }
  }
}
