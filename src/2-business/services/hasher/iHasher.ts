// Isso aqui vai ser usada para que algem injete dinamente
// uma depencia em tempo de execucao
export const IHasherServiceToken = Symbol.for('IHasherServiceToken')
// Aqui espera-se que no futoro alguem implemente e isso
// pode ser usada para nesse futuro quem impleementar no
// create gere o hash e compara testaria, por exemplo, se
// uma senha seria igual a um hash
export interface IHasherService {
  create: (s: string) => Promise<string>
  compare: (s: string, h: string) => Promise<boolean>
}
