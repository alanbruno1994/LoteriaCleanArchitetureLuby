import { inject, injectable } from 'inversify'
import type {
  IInputCreateUserDto,
  IOutputCreateUserDto
} from '@root/src/2-business/dto/user/create'
import {
  IUserRepository,
  IUserRepositoryToken
} from '@root/src/2-business/repositories/user/iUserRepository'
import { UserEntity } from '@root/src/1-domain/entities/userEntity'
import { left, right } from '@shared/either'
import {
  IHasherService,
  IHasherServiceToken
} from '@root/src/2-business/services/hasher/iHasher'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken
} from '@root/src/2-business/services/uniqueIdentifier/iUniqueIdentifier'
import { UserErrors } from '@business/modules/errors/user/userErrors'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable() // Aqui indica que a classe faz parte das injecoes dinamicas
export class CreateUserUseCase
implements IAbstractUseCase<IInputCreateUserDto, IOutputCreateUserDto> {
  // @inject e usado para faz as injecoes dinamicas, ou seja, em tempo de
  // execucao.
  constructor (
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @inject(IHasherServiceToken) private readonly hasherService: IHasherService,
    @inject(IUniqueIdentifierServiceToken)
    private readonly uniqueIdentifierService: IUniqueIdentifierService
  ) {}

  async exec (input: IInputCreateUserDto): Promise<IOutputCreateUserDto> {
    const hashPassword = await this.hasherService.create(input.password)

    const createUser = UserEntity.create({
      ...input,
      password: hashPassword
    })
    const user = {
      ...createUser.value.export(),
      secureId: this.uniqueIdentifierService.create()
    }
    try {
      const userEntity = await this.userRepository.create(user, input.accessProfileId)

      return right(userEntity)
    } catch (error) {
      return left(UserErrors.entityCreationError())
    }
  }
}
