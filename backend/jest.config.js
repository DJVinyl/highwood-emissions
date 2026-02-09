const { defaults: tsJestPreset } = require('ts-jest/presets');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        ...tsJestPreset,
        tsconfig: '<rootDir>/test/tsconfig.json',
        isolatedModules: true,
        diagnostics: false,
      },
    ],
  },
  testPathIgnorePatterns: ['<rootDir>/build/'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
};
