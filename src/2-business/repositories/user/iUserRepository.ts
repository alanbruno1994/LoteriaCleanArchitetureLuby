import { IUserEntity } from '@domain/entities/userEntity'
// Isso aqui serve para dizer que tipos de elementos
// serao usado como uma chave para um consulta de dados
// por exemplo
export type UserEntityKeys = keyof Omit<
IUserEntity,
'access' | 'password' | 'created_at' | 'updated_at'
>
