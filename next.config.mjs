import TerserPlugin from 'terser-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // استبعاد onnxruntime-web من الضغط لأن Terser لا يفهم ملفات .mjs الخاصة به
      config.optimization.minimizer = [
        new TerserPlugin({
          exclude: /node_modules[\\/]onnxruntime-web/,
        }),
      ];
    }
    return config;
  },
};

export default nextConfig;