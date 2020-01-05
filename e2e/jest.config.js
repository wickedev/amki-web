module.exports = {
    preset: 'jest-puppeteer',
    collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    testMatch: [
        '<rootDir>/**/?(*.)(spec|test).(j|t)s?(x)',
        '<rootDir>/**/__tests__/**/*.(j|t)s?(x)',
    ],
    transform: {
        '^.+\\.(ts|tsx|js|jsx|mjs)$': 'babel-jest',
    },
}
