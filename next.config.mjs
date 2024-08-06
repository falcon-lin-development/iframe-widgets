/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';

const enableBundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = enableBundleAnalyzer({
  // output: 'standalone', // for docker
  webpack: (config, { isServer, webpack }) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
      canvas: 'commonjs canvas',
    });
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@microsoft/typescript-etw': false,
    };

    // if (isServer) {

    //   config.plugins.push(
    //     new webpack.IgnorePlugin({
    //       resourceRegExp: /^(@aws-sdk\/|aws-cdk-lib\/|@aws-amplify\/)/,
    //       contextRegExp: /aws-cdk-lib|@aws-amplify/,
    //     })
    //   );
    // }
    // config.infrastructureLogging = {
    //   // debug: /PackFileCache/
    //   level: "error"
    // };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    ENV: process.env.ENV,
    AUTH_ENV: process.env.AUTH_ENV,
    API_URL: process.env.API_URL,
    WEBAPP_URL: process.env.WEBAPP_URL,
    GOOGLE_OAUTH_CALLBACK_URL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
    GA_ID: process.env.GA_ID,
    MINT721_API_URL: process.env.MINT721_API_URL,
    START_MY_MBTI_URL: process.env.START_MY_MBTI_URL,
    SHARE_MY_TEST_TO_FRD_URL: process.env.SHARE_MY_TEST_TO_FRD_URL,
    // CUSTOMER_IO_SITE_ID: CUSTOMER_IO_SITE_ID,
    // CUSTOMER_IO_API_KEY: CUSTOMER_IO_API_KEY,
  },
});

export default nextConfig;
