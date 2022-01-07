import { IOutputDeleteGameDto } from '@business/dto/game/delete'
import { GameErrors } from '@business/modules/errors/game/gameErrors'
import { IGameRepository, IGameRepositoryToken, IInputDeleteGame } from '@business/repositories/game/iGameRepository'
import { left, right } from '@shared/either'
import { inject, injectable } from 'inversify'
import { IAbstractUseCase } from '../abstractUseCase'

@injectable()
export class DeleteGameUseCase
implements IAbstractUseCase<IInputDeleteGame, IOutputDeleteGameDto> {
  constructor (
    @inject(IGameRepositoryToken) private readonly userRepository: IGameRepository
  ) {}

  async exec (input: IInputDeleteGame): Promise<IOutputDeleteGameDto> {
    const userToDelete = await this.userRepository.delete({
      key: input.key,
      value: input.value
    })
    if (!userToDelete) {
      return left(GameErrors.gameFailedToDelete())
    }

    return right(userToDelete)
  }
}
