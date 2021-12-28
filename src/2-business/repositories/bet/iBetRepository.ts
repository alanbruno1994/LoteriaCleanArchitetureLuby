import { IBetEntity } from '@domain/entities/betEntity'
// Isso aqui serve para dizer que tipos de elementos
// serao usado como uma chave para um consulta de dados
// por exemplo
export type BetEntityKeys = keyof Omit<
IBetEntity,
'game' |'user' | 'password' | 'created_at' | 'updated_at'
>
