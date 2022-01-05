import { IInputCreateUserDto } from '@business/dto/user/create'
import { InputUserEntity, IUserEntity } from '@domain/entities/userEntity'

export const fakeCreatedUserEntity: InputUserEntity = {
  name: 'alan bruno rios miguel',
  email: 'bruno47rios@outlook.com',
  password: 'fake_password'
}

export const fakeNewUser: IInputCreateUserDto = {
  email: 'fake@email',
  name: 'fake full name',
  password: 'fake_password',
  access_profile_id: 0
}

export const fakeUserEntityPlayer: IUserEntity = {
  ...fakeCreatedUserEntity,
  id: 1,
  access_profile_id: 2,
  token_recover_password: '',
  token_recover_password_create_date: undefined,
  secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',
  access: {
    id: 1,
    level: 'player',
    secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017f',
    created_at: new Date(),
    updated_at: new Date()
  },
  created_at: new Date(),
  updated_at: new Date()
}

export const fakeUserEntityAdmin: IUserEntity = {
  ...fakeCreatedUserEntity,
  id: 1,
  access_profile_id: 1,
  token_recover_password: '',
  token_recover_password_create_date: undefined,
  secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',
  access: {
    id: 1,
    level: 'admin',
    secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017f',
    created_at: new Date(),
    updated_at: new Date()
  },
  created_at: new Date(),
  updated_at: new Date()
}
// Nao desejo que a senha dos usuarios retornem
export const fakeUsersList: Array<Omit<IUserEntity, 'password'>> = [
  {
    id: 1,
    name: 'bruno',
    email: 'bruno@gmail.com',
    secure_id: '123e4567-e89b-12d3-a456-426614174000',
    access_profile_id: 1,
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 2,
    name: 'ricardo',
    email: 'ricado@gmail.com',
    secure_id: '123e4567-e89b-12d3-a456-426614174001',
    access_profile_id: 1,
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 3,
    name: 'pedro',
    email: 'pedro@gmail.com',
    secure_id: '123e4567-e89b-12d3-a456-426614174002',
    access_profile_id: 1,
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 4,
    name: 'lucas',
    email: 'lucas@gmail.com',
    secure_id: '123e4567-e89b-12d3-a456-426614174003',
    access_profile_id: 1,
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  }
]
