/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
}

module.exports = nextConfig
