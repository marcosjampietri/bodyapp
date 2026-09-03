const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Keep as .js
  testMatch: [
    "**/__tests__/**/*.test.[jt]s?(x)", // Keep as .js
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // add @ alias for absolute imports
  },
  transformIgnorePatterns: ["node_modules/(?!(react-calendar|@wojtekmaj)/)"],
};

module.exports = createJestConfig(customJestConfig);
