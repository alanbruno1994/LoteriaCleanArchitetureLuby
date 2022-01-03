/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { injectable } from 'inversify'
import { ValidationError } from 'class-validator'
import { AbstractSerializer } from '../serializers/abstractSerializer'
import { validationError } from '@business/modules/errors/validationErrors'

@injectable()
export abstract class AbstractOperator<I, O> {
  abstract run (input: I, ...args: unknown[]): Promise<O>

  protected exec (input: AbstractSerializer<I>): void {
    try {
      input.validate()
    } catch (error) {
      if (
        error instanceof Array &&
        (error.length > 0) &&
        error[0] instanceof ValidationError
      ) {
        const validationErrors = error as ValidationError[]

        const details = validationErrors.map((error: any) => ({
          property: error.property,
          value: `value <${error.value}> did not pass validation`,
          errors: Object.entries(error.constraints).map(([, value]) => value)
        }))

        throw validationError(details)
      }
    }
  }
}
