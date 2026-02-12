export type Command = {
  id: string;
  commandName: string;
  startedAt: Date;
  endedAt: Date;
  metadata: Record<string, any> | null;
};
