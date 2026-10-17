/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... أي إعدادات أخرى لديك ...

  experimental: {
    serverComponentsExternalPackages: ['@imgly/background-removal', 'onnxruntime-web'],
  },
  
  webpack: (config, { isServer }) => {
    // تجاهل هذه المكتبات على الخادم
    if (isServer) {
      config.externals.push('@imgly/background-removal', 'onnxruntime-web');
    }

    // إعدادات إضافية للتعامل مع ملفات wasm في المتصفح
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
};

module.exports = nextConfig;