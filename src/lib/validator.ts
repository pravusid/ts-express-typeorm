import { validate } from 'class-validator';
import { CustomValidationError } from '../domain/error/validation.error';

export const validation = async <T>(arg: T): Promise<T> => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const errors = await validate(arg as unknown as object);

  if (errors.length > 0) {
    throw new CustomValidationError(errors);
  }

  return arg;
};
