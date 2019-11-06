export class CustomInternalError extends Error {
  get stackArray(): string[] {
    return this.stack ? this.stack.split('\n').map(s => s.trim()) : [];
  }
}
