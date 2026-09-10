import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 車站、道路與鐵路頁面的 title/description 由資料庫動態產生。
  // SEO crawler 與 Lighthouse 需要在初始 <head> 就讀得到它們，而不是等待
  // Next 的 metadata streaming 將標籤追加到 <body>。
  htmlLimitedBots: /.*/,
  compiler: {
    // 啟用 styled-components SSR 支援，保證 Client 與 Server 的 className 一致
  },
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["lucide-react", "@iconify/react"],
  },
  images: {
    minimumCacheTTL: 31536000,
    unoptimized: false,
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
