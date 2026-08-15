import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/site-assets/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54421",
        pathname: "/storage/v1/object/public/site-assets/**",
      },
    ],
  },
  // Permite testar o servidor de desenvolvimento em celulares e outros
  // dispositivos conectados à mesma rede local.
  allowedDevOrigins: ["192.168.15.5"],
};
export default nextConfig;
