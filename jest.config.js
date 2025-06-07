module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: [
    '**/lib/**/*.test.ts?(x)',
    '**/orion_python_backend/**/*.test.ts?(x)',
    '**/scripts/**/*.test.ts?(x)',
    '**/tests/**/*.test.ts?(x)'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  clearMocks: true,
  testTimeout: 30000,
  transformIgnorePatterns: [
    "/node_modules/(?!d3|d3-.*)"
  ]
};
