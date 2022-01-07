import { IAuthenticatorService, IAuthenticatorServiceToken } from '@business/services/authenticator/iAuthenticator'
import { AuthenticatorService } from '@framework/services/auth/AuthenticatorService'
import {
  IHasherService,
  IHasherServiceToken
} from '@root/src/2-business/services/hasher/iHasher'
import {
  IUniqueIdentifierService,
  IUniqueIdentifierServiceToken
} from '@root/src/2-business/services/uniqueIdentifier/iUniqueIdentifier'
import { ContainerModule, interfaces } from 'inversify'
import { HasherService } from '../services/hasher/hasherService'
import { UniqueIdentifierService } from '../services/uniqueIdentifier/uniqueIdentifierService'

export const servicesModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IHasherService>(IHasherServiceToken).to(HasherService)
  bind<IUniqueIdentifierService>(IUniqueIdentifierServiceToken).to(
    UniqueIdentifierService
  )
  bind<IAuthenticatorService>(IAuthenticatorServiceToken).to(AuthenticatorService)
})
