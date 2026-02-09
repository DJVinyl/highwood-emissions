import pino from 'pino';

const isSilencedEnv = process.env.NODE_ENV === 'test' ? 'silent' : 'info';
const isLocal = process.env.NODE_ENV === 'local';

export const asyncLogger = pino(
  {
    level: isSilencedEnv,
    ...(isLocal && {
      transport: {
        target: 'pino-pretty',
      },
    }),
  },
  pino.destination({ sync: false }),
);
