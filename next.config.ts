import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // 啟用 styled-components SSR 支援，保證 Client 與 Server 的 className 一致
    styledComponents: true,
  },
  images: {
    minimumCacheTTL: 31536000,
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "my-road-trip-archive-photos.s3.ap-east-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      // 如果以後還會用其他 S3 bucket，也可以這樣開放所有 amazonaws.com：
      // {
      //   protocol: "https",
      //   hostname: "*.amazonaws.com",
      // },
    ],
  },
  /* config options here */
};

export default nextConfig;
