/** @type {import('next').NextConfig} */

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnlineNav: true,
  swcMinify: true,
  disable:false,
  workboxOptions:{
    disableDevLogs:true,
  }
});

const nextConfig = {
  images: {
      // domains: ['api.unchiudaanclasses.com'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'api.unchiudaanclasses.com',
          pathname: '**',
        },
      ],
    },
};

export default withPWA(nextConfig);

