import * as cv from 'class-validator';
import { CustomValidationError } from '../domain/error/validation.error.js';

export const validate = async <T extends object>(arg: T): Promise<T> => {
  const errors = await cv.validate(arg);

  if (errors.length > 0) {
    throw new CustomValidationError(errors);
  }

  return arg;
};
