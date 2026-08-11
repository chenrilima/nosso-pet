import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // Permite testar o servidor de desenvolvimento em celulares e outros
  // dispositivos conectados à mesma rede local.
  allowedDevOrigins: ["192.168.15.5"],
};
export default nextConfig;
