// Mock expo-modules-core
jest.mock('expo-modules-core', () => ({
  NativeModulesProxy: {},
  requireNativeModule: jest.fn(() => ({})),
  requireOptionalNativeModule: jest.fn(() => null),
  EventEmitter: class EventEmitter {
    addListener = jest.fn();
    removeListener = jest.fn();
    removeAllListeners = jest.fn();
    emit = jest.fn();
  },
  Subscription: class Subscription {
    remove = jest.fn();
  },
  Platform: {
    OS: 'android',
  },
}));

// Set up environment variables
process.env.EXPO_OS = 'android';

// Mock console methods to avoid cluttering test output
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
