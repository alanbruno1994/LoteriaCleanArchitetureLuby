import { IInputCreateAccessProfileDto } from '@business/dto/access/create'
import { IAccessProfileEntity, InputAccessProfileEntity } from '@domain/entities/accessProfileEntity'

export const fakeCreatedAccessProfileEntity: InputAccessProfileEntity = {
  level: 'admin'
}

export const fakeNewAccessProfile: IInputCreateAccessProfileDto = {
  level: 'admin'
}

export const fakeAccessProfileEntity: IAccessProfileEntity = {
  ...fakeCreatedAccessProfileEntity,
  id: 1,
  secure_id: '7b1f3001-6a4b-4bdd-90e9-8a280fff017d',
  users: undefined,
  created_at: new Date(),
  updated_at: new Date()
}

export const fakeAccessProfileList: IAccessProfileEntity[] = [
  {
    id: 1,
    level: 'admin',
    secure_id: '123e4567-e89b-12d3-a456-426614174000',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 2,
    level: 'client',
    secure_id: '123e4567-e89b-12d3-a456-426614174001',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 3,
    level: 'manager',
    secure_id: '123e4567-e89b-12d3-a456-426614174002',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  },
  {
    id: 4,
    level: 'employee',
    secure_id: '123e4567-e89b-12d3-a456-426614174003',
    created_at: new Date('2021-09-21T10:00:00.000Z'),
    updated_at: new Date('2021-09-21T10:00:00.000Z')
  }
]
