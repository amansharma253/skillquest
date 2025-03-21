module.exports = {
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/', // Transform axios for Jest compatibility
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest', // Use Babel to transform JavaScript files
  },
  testEnvironment: 'jsdom', // Set the test environment to jsdom for React tests
  moduleNameMapper: {
    '^axios$': 'axios/dist/axios.js', // Map axios to its CommonJS distribution
  },
};