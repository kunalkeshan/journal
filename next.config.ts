import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async redirects() {
    return [
      {
        source: '/sitemap-:n(\\d+).xml',
        destination: '/sitemap/:n.xml',
        permanent: true,
      },
      {
        source: '/sitemaps/sitemap-:n(\\d+).xml',
        destination: '/sitemap/:n.xml',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
