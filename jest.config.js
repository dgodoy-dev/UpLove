module.exports = {
  preset: "react-native",

  // TypeScript configuration
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  // Module file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Test match patterns
  testMatch: [
    "**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)",
  ],

  // Module path aliases (matching tsconfig.json)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Setup files
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: [],

  // Coverage configuration
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/__tests__/**",
  ],

  // Test environment
  testEnvironment: "node",

  // Clear mocks between tests
  clearMocks: true,

  // Automatically reset mock state before every test
  resetMocks: false,

  // Restore mocked functions to their original implementations
  restoreMocks: true,

  // Transformation ignore patterns for node_modules
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo|@expo|expo-.*|@expo/.*|react-native-.*|@react-navigation|uuid)/)",
  ],

  // Verbose output
  verbose: true,
};
