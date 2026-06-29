import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodError, ZodObject } from 'zod';
import { fromZodError } from 'zod-validation-error';

class ZodValidationPipe implements PipeTransform {
  private schema: ZodObject;

  constructor(schema: ZodObject) {
    this.schema = schema;
  }

  transform(value: unknown) {
    const message = 'Validation check failed.';

    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message,
          statusCode: 400,
          error: fromZodError(error),
        });
      }
    }
  }
}

export { ZodValidationPipe };
