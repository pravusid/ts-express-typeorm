import { CustomExternalError } from './custom.errors';
import { ValidationErrors } from '../../lib/validator';

export class ValidationError extends CustomExternalError {
  constructor(errors: ValidationErrors) {
    super(JSON.stringify(errors));
  }
}
