import { validate } from 'class-validator';
import { CustomValidationError } from '../domain/error/validation.error';

export const validation = async <T>(arg: T): Promise<T> => {
  const errors = await validate(arg);

  if (errors.length > 0) {
    throw new CustomValidationError(errors);
  }

  return arg;
};
