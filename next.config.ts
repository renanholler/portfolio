import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "192.168.255.126",
    "*.local",
  ],
  images: {
    // Next 16 defaults to quality 75 only; 100 is required for screenshot sharpness
    qualities: [75, 100],
  },
};

export default withNextIntl(nextConfig);
