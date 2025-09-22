/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // DISABLED - This prevents API routes from working
  images: {
    unoptimized: true,
  },
};

// Setup Cloudflare dev platform for local development
if (process.env.NODE_ENV === 'development') {
  const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
  setupDevPlatform();
}

module.exports = nextConfig;