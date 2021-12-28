import { IGameEntity } from '@domain/entities/gameEntity'
// Isso aqui serve para dizer que tipos de elementos
// serao usado como uma chave para um consulta de dados
// por exemplo
export type GameEntityKeys = keyof Omit<
IGameEntity,
'bets' |'users' | 'password' | 'created_at' | 'updated_at'
>
