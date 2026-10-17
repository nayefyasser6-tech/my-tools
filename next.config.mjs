/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@imgly/background-removal', 'onnxruntime-web'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@imgly/background-removal', 'onnxruntime-web');
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

export default nextConfig;