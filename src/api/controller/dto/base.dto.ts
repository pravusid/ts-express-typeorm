import { validate } from 'class-validator';
import { CustomExternalError } from '../../../domain/error/custom.external.error';

export abstract class BaseDto {
  constructor(payload: unknown) {
    Object.assign(this, payload);
  }

  async validate(): Promise<CustomExternalError | void> {
    const result = await validate(this);
    return result.length
      ? new CustomExternalError(result.flatMap((res) => Object.values(res.constraints ?? {})))
      : undefined;
  }

  async throw(): Promise<this> {
    const err = await this.validate();
    if (err) {
      throw err;
    }
    return this;
  }
}
