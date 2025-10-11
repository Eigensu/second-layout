const path = require("path");
const { config } = require("dotenv");

// Load environment variables from the root .env file
const rootEnvPath = path.resolve(__dirname, "../../.env");
config({ path: rootEnvPath });

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*", // FastAPI backend
      },
    ];
  },
};

module.exports = nextConfig;
