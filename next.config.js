/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async rewrites() {
    return [{ source: "/.well-known/assetlinks.json", destination: "/assetlinks.json" }];
  },
  async headers() {
    return [{ source: "/assetlinks.json", headers: [{ key: "Content-Type", value: "application/json" }] }];
  },
};
module.exports = nextConfig;
