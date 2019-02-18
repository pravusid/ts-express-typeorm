export class CustomExternalError extends Error {
  statusCode: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.statusCode = status;
  }
}

export class CustomInternalError extends Error {
  constructor(message: string) {
    super(message);
  }

  get stackArray(): string[] {
    return this.stack ? this.stack.split('\n').map(s => s.trim()) : [];
  }
}
