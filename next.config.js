/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: { root: __dirname }, // avoids root mis-detection
};
module.exports = nextConfig;
