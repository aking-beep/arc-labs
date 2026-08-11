/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/catalog": ["./skills/**/*", "./lib/skills/snapshot.json"],
    "/": ["./skills/**/*"],
  },
};

module.exports = nextConfig;
