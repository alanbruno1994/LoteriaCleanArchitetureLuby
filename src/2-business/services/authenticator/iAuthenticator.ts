import { IError } from '@shared/iError'
// Isso aqui vai ser usada para que algem injete dinamente
// uma depencia em tempo de execucao
export const IAuthenticatorServiceToken = Symbol.for(
  'IAuthenticatorServiceToken'
)

// Aqui se espera que no futuro alguem que use gere token ou que os validem
// implemente esta interface
export interface IAuthenticatorService {
  sign: (payload: { [k: string]: string | number | boolean }) => Promise<string>
  verify: (token: string) => Promise<{verify: boolean
    user_secure_id: string
    user_id: number } | IError>
}
