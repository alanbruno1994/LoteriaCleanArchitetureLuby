/* eslint-disable no-empty */
import { IServiceDataSend } from '@business/services/microservices/iServiceDataSend'
import { IBetEntity } from '@domain/entities/betEntity'
import { injectable } from 'inversify'

@injectable()
export class FakeServiceDataSendBet implements IServiceDataSend<IBetEntity> {
  async sendData (data: IBetEntity): Promise<void> {
    if (data) {}
  }
}

export const fakeServiceDataSendBet = jest.spyOn(
  FakeServiceDataSendBet.prototype,
  'sendData'
)
