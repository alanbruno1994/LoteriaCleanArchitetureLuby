import { IError } from '@shared/iError'
// Isso aqui vai ser usada para que algem injete dinamente
// uma depencia em tempo de execucao
export const IAuthenticatorServiceToken = Symbol.for(
  'IAuthenticatorServiceToken'
)

export interface ITokenVerifyFormat {
  [index: string]: number | string
}

// Aqui se espera que no futuro alguem que use gere token ou que os validem
// implemente esta interface
export interface IAuthenticatorService {
  sign: (payload: { [k: string]: string | number | boolean }) => Promise<string>
  verify: (token: string) => Promise<ITokenVerifyFormat | IError>
}
