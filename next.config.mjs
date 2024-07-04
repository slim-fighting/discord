/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io"
            }
        ],
    },
    webpack: (config, { isServer }) => {
        isServer && (config.externals = [...config.externals, 'socket.io-client']);
        return config;
    },
};

export default nextConfig;
