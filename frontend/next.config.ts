import type { NextConfig } from "next";

console.log(process.env);

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://localhost:3000', '55f7f999cbc2.ngrok.app', 'ade81fa24198.ngrok.app'],
  env: {
    'NEXT_PUBLIC_CLIENT_ID': process.env.NEXT_PUBLIC_CLIENT_ID,
    'NEXT_PUBLIC_PRIVY_APP_ID': process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    'NEXT_PUBLIC_PRIVY_APP_SECRET': process.env.NEXT_PUBLIC_PRIVY_APP_SECRET,
    'NEXT_PUBLIC_API_TOKEN': process.env.NEXT_PUBLIC_API_TOKEN,
    'NEXT_PUBLIC_AGGY_PRIVATE_KEY': process.env.NEXT_PUBLIC_AGGY_PRIVATE_KEY,
    'NEXT_PUBLIC_AGGY_WALLET_ADDRESS': process.env.NEXT_PUBLIC_AGGY_WALLET_ADDRESS,
    'NEXT_PUBLIC_MULTIBAAS_URL': process.env.NEXT_PUBLIC_MULTIBAAS_URL,
    'NEXT_PUBLIC_MULTIBAAS_KEY': process.env.NEXT_PUBLIC_MULTIBAAS_KEY,
    'NEXT_PUBLIC_MULTIBAAS_CHAIN_ID': process.env.NEXT_PUBLIC_MULTIBAAS_CHAIN_ID,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
