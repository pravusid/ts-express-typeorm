import { validate } from 'class-validator';
import { ValidationError } from '../domain/error/validation.error';

export type ValidationErrors = { [error: string]: string }[];

export const validation = async <T>(arg: T): Promise<T> => {
  const errors = await validate(arg);
  const result = [...errors.map(e => e.constraints)];
  if (result.length > 0) {
    throw new ValidationError(result);
  }
  return arg;
};
