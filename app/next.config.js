/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...defaultConfig,
      reactStrictMode: true,
      publicRuntimeConfig: {
        PUBLIC_CONTRACT: process.env.CONTRACT_NAME
      },
    }
  }
  return {
    ...defaultConfig,
    reactStrictMode: true,
  }
}
