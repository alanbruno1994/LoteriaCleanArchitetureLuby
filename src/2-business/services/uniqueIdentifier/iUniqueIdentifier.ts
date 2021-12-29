// Isso aqui vai ser usada para que algem injete dinamente
// uma depencia em tempo de execucao
export const IUniqueIdentifierServiceToken = Symbol.for(
  'IUniqueIdentifierServiceToken'
)
// Isso aqui sera usado para que algem no futuro implemente
// e possa gerar um secureId, por exemplo
export interface IUniqueIdentifierService {
  create: () => string
}
