import { IOutputDeleteAccessProfileDto } from '@business/dto/access/delete'
import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { DeleteAccessProfileUseCase } from '@business/useCases/access/deleteAccessProfileUseCase'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { InputDeleteAccessProfile } from '@controller/serializers/access/inputDeleteAccessProfile'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class DeleteAccessProfileOperator extends AbstractOperator<
InputDeleteAccessProfile,
IOutputDeleteAccessProfileDto
> {
  constructor (
    @inject(FindAccessProfileByUseCase) private readonly findAccessProfileByUseCase: FindAccessProfileByUseCase,
    @inject(DeleteAccessProfileUseCase) private readonly deleteAccessProfileUseCase: DeleteAccessProfileUseCase
  ) {
    super()
  }

  async run (
    input: InputDeleteAccessProfile
  ): Promise<IOutputDeleteAccessProfileDto> {
    await this.exec(input)
    const accessForDeletion = await this.findAccessProfileByUseCase.exec({
      key: 'secure_id',
      value: input.secure_id
    })

    if (accessForDeletion.isLeft()) {
      return left(AccessProfileErrors.accessProfileNotFound())
    }

    const accessResult = await this.deleteAccessProfileUseCase.exec({
      key: 'id',
      value: accessForDeletion.value.id
    })

    if (accessResult.isLeft()) {
      return left(accessResult.value)
    }

    return right(accessResult.value)
  }
}
