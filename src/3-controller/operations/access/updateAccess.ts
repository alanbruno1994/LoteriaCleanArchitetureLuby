/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { IOutputUpdateAccessProfileDto } from '@business/dto/access/update'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { UpdateAccessProfileUseCase } from '@business/useCases/access/updateAccessProfileUseCase'
import { InputUpdateAccessProfile } from '@controller/serializers/access/inputUpdateAccessProfile'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class UpdateAccessProfileOperator extends AbstractOperator<
InputUpdateAccessProfile,
IOutputUpdateAccessProfileDto
> {
  constructor (
    @inject(FindAccessProfileByUseCase) private readonly findAccessProfileByUseCase: FindAccessProfileByUseCase,
    @inject(UpdateAccessProfileUseCase) private readonly updateAccessProfileUseCase: UpdateAccessProfileUseCase
  ) {
    super()
  }

  async run (
    input: InputUpdateAccessProfile, secure_id: string
  ): Promise<IOutputUpdateAccessProfileDto> {
    this.exec(input)
    const existentAccess = await this.findAccessProfileByUseCase.exec({
      key: 'secure_id',
      value: secure_id
    })

    if (existentAccess.isLeft()) {
      return left(AccessProfileErrors.accessProfileNotFound())
    }

    const roleUpdated = await this.updateAccessProfileUseCase.exec(
      {
        ...existentAccess.value,
        level: input.level ? input.level : existentAccess.value.level
      },
      { column: 'id', value: existentAccess.value.id }
    )

    if (roleUpdated.isLeft()) {
      return left(roleUpdated.value)
    }

    return right(roleUpdated.value)
  }
}
