import { IServiceDataSend } from '@business/services/microservices/iServiceDataSend'
import { IBetEntity } from '@domain/entities/betEntity'
import { injectable } from 'inversify'
import { Kafka } from 'kafkajs'

@injectable()
export class ServiceDataSendBet implements IServiceDataSend<IBetEntity> {
  async sendData (data: IBetEntity): Promise<void> {
    const kafka = new Kafka({
      clientId: 'api',
      brokers: ['kafka:29092'] // kafka e o nome do broker que esta no docker-compose.yml
    })
    const producer = kafka.producer()
    await producer.connect()
    await producer.send({
      topic: 'bet_delete',
      messages: [
        {
          value: JSON.stringify({
            game_id: data.game_id,
            user_id: data.user_id,
            number_choose: data.number_choose,
            price_game: data.price_game
          })
        }
      ]
    })
    await producer.disconnect()
  }
}
