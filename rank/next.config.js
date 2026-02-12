/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // Outputs a Single-Page Application (SPA).
  distDir: "./build", // Changes the build output directory to `./dist`.
  reactStrictMode: false,
  experimental: {
    // Disable Pages Router - we're using App Router only
    appDir: true,
  },
};

export default nextConfig;
