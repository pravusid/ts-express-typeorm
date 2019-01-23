import { CustomError } from './custom.error';
import { ValidationErrors } from '../../lib/validator';

export class ValidationError extends CustomError {
  constructor(errors: ValidationErrors) {
    super(400, JSON.stringify(errors));
  }
}
