/** @type {import('next').NextConfig} */
const nextConfig = {
    // webpack: (config) => {
    //     config.externals.push({
    //         "utf-8-validate": "commonjs utf-8-validate",
    //         bufferutil: "commonjs bufferutil"
    //     });

    //     return config;
    // },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io"
            }
        ],
    },
    // webpack: (config, { isServer }) => {
    //     isServer && (config.externals = [...config.externals, 'socket.io-client']);
    //     return config;
    // },
    
};

export default nextConfig;
