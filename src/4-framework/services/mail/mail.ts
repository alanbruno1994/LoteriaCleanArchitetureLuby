import path from 'path'
import { IMailService } from '@root/src/2-business/services/mail/iMail'
import { injectable } from 'inversify'
import nodemailer from 'nodemailer'
import edge from 'edge.js'
import { IInputSendMailDto } from '@root/src/2-business/dto/user/sendMail'

@injectable()
export class MailService implements IMailService {
  private readonly transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  })

  async send (input: IInputSendMailDto): Promise<void> {
    edge.mount(path.join(__dirname, '..', '..', 'services', 'mail', 'views'))

    const html = await edge.render(input.templatePath, input.payload)

    await this.transport.sendMail({
      from: 'fake@email.com.br',
      to: input.to,
      subject: input.subject,
      html
    })
  }
}
