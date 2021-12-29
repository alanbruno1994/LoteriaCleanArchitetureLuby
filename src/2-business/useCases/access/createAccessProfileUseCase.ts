import { inject, injectable } from 'inversify'
import { left, right } from '@shared/either'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken
} from '@root/src/2-business/services/uniqueIdentifier/iUniqueIdentifier'
import { IAbstractUseCase } from '../abstractUseCase'
import { IInputCreateAccessProfileDto, IOutputCreateAccessProfileDto } from '@business/dto/access/create'
import { AccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { IAccessProfileRepository, IAccessProfileRepositoryToken } from '@business/repositories/accessprofile/iAccessProfileRepository'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'

@injectable() // Aqui indica que a classe faz parte das injecoes dinamicas
export class CreateAccessProfileUseCase
implements IAbstractUseCase<IInputCreateAccessProfileDto, IOutputCreateAccessProfileDto> {
  // @inject e usado para faz as injecoes dinamicas, ou seja, em tempo de
  // execucao.
  constructor (
    @inject(IAccessProfileRepositoryToken) private readonly accessRepository: IAccessProfileRepository,
    @inject(IUniqueIdentifierServiceToken)
    private readonly uniqueIdentifierService: IUniqueIdentifierService
  ) {}

  async exec (input: IInputCreateAccessProfileDto): Promise<IOutputCreateAccessProfileDto> {
    const createAccessProfile = AccessProfileEntity.create(input)
    const access = {
      ...createAccessProfile.value.export(),
      secureId: this.uniqueIdentifierService.create()
    }
    try {
      const accessEntity = await this.accessRepository.create(access)
      return right(accessEntity)
    } catch (error) {
      return left(AccessProfileErrors.entityCreationError())
    }
  }
}
