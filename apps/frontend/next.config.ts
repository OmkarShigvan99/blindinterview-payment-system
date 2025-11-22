import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: ['framer-motion'],
    },
    webpack(config) {
        config.resolve.alias['@shared'] = path.resolve(__dirname, '../shared');

        // Handle framer-motion's export * issue
        config.resolve.alias['framer-motion'] = require.resolve('framer-motion');

        return config;
    },
};

export default nextConfig;
