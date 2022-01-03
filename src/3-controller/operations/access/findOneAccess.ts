import { AccessProfileErrors } from '@business/modules/errors/access/accessProfileErrors'
import { FindAccessProfileByUseCase } from '@business/useCases/access/findAccessProfileByUseCase'
import { InputByAccessProfile } from '@controller/serializers/access/inputByAccessProfile'
import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'
import { Either, left, right } from '@shared/either'
import { IError } from '@shared/iError'
import { inject, injectable } from 'inversify'
import { AbstractOperator } from '../abstractOperator'

@injectable()
export class FindOneAccessProfileOperator extends AbstractOperator<
InputByAccessProfile,
Either<IError, IAccessProfileEntity>
> {
  constructor (
    @inject(FindAccessProfileByUseCase) private readonly findAccessProfileByUseCase: FindAccessProfileByUseCase
  ) {
    super()
  }

  async run (input: InputByAccessProfile): Promise<Either<IError, IAccessProfileEntity>> {
    this.exec(input)

    const access = await this.findAccessProfileByUseCase.exec({
      key: 'secureId',
      value: input.secureId
    })

    if (access.isLeft()) {
      return left(AccessProfileErrors.accessProfileNotFound())// revisar
    }

    Object.defineProperty(access.value, 'id', {
      enumerable: false
    })

    return right(access.value)
  }
}
