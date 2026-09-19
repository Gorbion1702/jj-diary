import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mengizinkan akses dari HP/IP Lokal
  allowedDevOrigins: ['192.168.18.63', 'localhost'],
};

export default nextConfig;