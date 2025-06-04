module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: [
    '**/lib/**/*.test.ts?(x)',
    '**/orion_python_backend/**/*.test.ts?(x)',
    '**/scripts/**/*.test.ts?(x)'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  }
};
