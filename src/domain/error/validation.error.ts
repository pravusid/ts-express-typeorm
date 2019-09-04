import { ValidationErrors } from '../../lib/validator';
import { CustomExternalError } from './custom.errors';

export class ValidationError extends CustomExternalError {
  constructor(errors: ValidationErrors) {
    super([
      ...errors.map(x => {
        const [value] = Object.values(x);
        return value;
      }),
    ]);
  }
}
