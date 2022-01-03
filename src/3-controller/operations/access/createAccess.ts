import { IOutputCreateAccessProfileDto } from '@business/dto/access/create'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { CreateAccessProfileUseCase } from '@business/useCases/access/createAccessProfileUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { InputCreateAccessProfile } from '@controller/serializers/access/inputCreateAccessProfile'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class CreateAccessProlfileOperator extends AbstractOperator<
InputCreateAccessProfile,
IOutputCreateAccessProfileDto
> {
  constructor (
    @inject(CreateAccessProfileUseCase) private readonly createAccessProfileUseCase: CreateAccessProfileUseCase,
    @inject(FindAccessProfileByUseCase) private readonly findAccessProfileUseCase: FindAccessProfileByUseCase
  ) {
    super()
  }

  async run (input: InputCreateAccessProfile): Promise<IOutputCreateAccessProfileDto> {
    this.exec(input) // Aqui valida os dados de entrada

    const isAccessAlreadyRegistered = await this.findAccessProfileUseCase.exec({
      key: 'level',
      value: input.level
    })

    if (isAccessAlreadyRegistered.isRight()) {
      return left(AccessProfileErrors.accessProfileLevelAlreadyInUse())
    }

    const accessResult = await this.createAccessProfileUseCase.exec(input)

    if (accessResult.isLeft()) {
      return left(accessResult.value)
    }

    return right(accessResult.value)
  }
}
