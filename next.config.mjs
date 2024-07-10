/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 排除 'module-name' 模块
      config.externals.push("node-ssh");
    }

    return config;
  },
};

export default nextConfig;