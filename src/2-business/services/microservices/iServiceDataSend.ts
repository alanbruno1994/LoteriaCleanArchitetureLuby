// Isso aqui vai ser usada para que algem injete dinamente
// uma depencia em tempo de execucao
export const IServiceDataSendToken = Symbol.for(
  'IServiceDataSendeToken'
)
// Isso aqui sera usado para que algem no futuro implemente
// e possa gerar um secure_id, por exemplo
export interface iServiceDataSend<T> {
  sendData: (data: T) => Promise<void>
}
