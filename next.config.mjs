/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  /* config options here */
  // reactCompiler: true,
  // turbopack: {
  //   // Set the root directory explicitly to avoid the multiple lockfiles warning
  //   root: '/Users/mac/Desktop/geoportal-frontend'
  // },
  experimental: {
    esmExternals: true // This helps with ES modules resolution
  }
};

export default withNextIntl(nextConfig);
