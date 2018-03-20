module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['index.js', '!**/node_modules/**'],
  verbose: true,
  collectCoverage: false,
  coverageReporters: ['json', 'html']
};
