import { IAccessProfileEntity } from '@domain/entities/accessProfileEntity'
// Isso aqui serve para dizer que tipos de elementos
// serao usado como uma chave para um consulta de dados
// por exemplo
export type AccessProfileEntityKeys = keyof Omit<
IAccessProfileEntity,
'game' |'user' | 'password' | 'created_at' | 'updated_at'
>
