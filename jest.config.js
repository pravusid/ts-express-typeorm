module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  testRegex: '^.+\\.spec\\.(js|jsx|ts|tsx)$',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  testEnvironment: 'node',
};
