import { ITimeService } from '@root/src/2-business/services/time/iTime'
import { injectable } from 'inversify'
import stringToMs from 'string-to-ms'

@injectable()
export class TimeService implements ITimeService {
  add (miliseconds: number, baseDate = new Date()): Date {
    const baseDateMili = baseDate.getTime()

    const addedDate = new Date(baseDateMili + miliseconds)

    return addedDate
  }

  toMilliseconds (prop: string): number {
    return stringToMs(prop)
  }

  compare (milisecondsEnter: number, milisecondsCompare: number): boolean {
    return milisecondsEnter > milisecondsCompare
  }
}
