process.env.TESTING = 'true';

module.exports = {
  rootDir: __dirname,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^tests/(.*)$': '<rootDir>/testing-tools/$1',
  },
  snapshotSerializers: [],
  testMatch: ['**/*.spec.(ts|tsx)'],
  testURL: 'http://localhost/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  modulePathIgnorePatterns: [
    'node_modules',
    'exceptions',
    'tests',
    'dist',
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    'exceptions',
    'tests',
    'dist',
  ],
  coverageThreshold: {
    global: {
      branches: 99,
      functions: 99,
      lines: 99,
      statements: 99,
    },
  },
};
