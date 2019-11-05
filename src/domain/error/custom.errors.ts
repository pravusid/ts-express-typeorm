export class CustomExternalError extends Error {
  constructor(public messages: string[], public statusCode: number = 400) {
    super();
  }
}

export class CustomInternalError extends Error {
  get stackArray(): string[] {
    return this.stack ? this.stack.split('\n').map(s => s.trim()) : [];
  }
}
