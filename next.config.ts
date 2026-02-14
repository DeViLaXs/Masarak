import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.masarak.app/api/:path*',
      },
    ]
  },
}

export default nextConfig
