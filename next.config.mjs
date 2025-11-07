/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    // Set the root directory explicitly to avoid the multiple lockfiles warning
    root: '/Users/mac/Desktop/geoportal-frontend'
  },
  experimental: {
    esmExternals: true // This helps with ES modules resolution
  }
};

export default nextConfig;
