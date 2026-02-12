export interface CommandInterface<T> {
  execute(payload: T): Promise<void>;
  undo?(): Promise<void>;
}
