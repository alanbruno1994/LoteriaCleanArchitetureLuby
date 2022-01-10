/* eslint-disable no-empty */
import { IInputAuthorizeAccessProfileDto, IOutputAuthorizeAccessProfileDto } from '@business/dto/access/authorize'
import { AuthorizeAccessProfileUseCase } from '@business/useCases/access/authorizeAccessProfileUseCase'
import { right } from '@shared/either'
import { injectable } from 'inversify'

@injectable()
export class FakerAuthorizeAccessProfileUseCase extends AuthorizeAccessProfileUseCase {
  async exec (input: IInputAuthorizeAccessProfileDto): Promise<IOutputAuthorizeAccessProfileDto> {
    if (input) { }
    return right(void 0)
  }
}

export const FakerExecAuthorizeAccessProfileUseCase = jest.spyOn(
  FakerAuthorizeAccessProfileUseCase.prototype,
  'exec'
)
