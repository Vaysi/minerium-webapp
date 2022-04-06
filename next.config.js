/** @type {import('next').NextConfig} */
const withOffline = require('next-offline')

const nextConfig = {
  assetPrefix: "/"
}

module.exports = withOffline(nextConfig);