import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite conexiones HMR (Hot Module Replacement) desde la IP de la red local
  allowedDevOrigins: ['172.30.128.1', 'localhost'],
};

export default nextConfig;
