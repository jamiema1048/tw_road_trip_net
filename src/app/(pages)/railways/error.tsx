"use client";

import React, { FC, useEffect } from "react";
import Head from "next/head";
import styled from "styled-components";
import ErrorPageClient from "@/src/app/(client)/(ErrorPage)/ErrorPageClient";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column; /* 1. 讓圈圈與文字上下垂直排列 */
  justify-content: center; /* 2. 垂直居中 */
  align-items: center; /* 3. 水平居中 */
  width: 100%;
  min-height: 100vh; /* 4. 關鍵：撐滿螢幕高度，確保垂直居中 */
  background-color: transparent;
  background-color: transparent;
  gap: 3rem;
`;

interface ErrorProps {
  error: Error & { digest?: string }; // Next.js 自動傳入的 Error 物件
  reset: () => void; // Next.js 自動傳入的重試函式
}

const Error: FC<ErrorProps> = ({ error, reset }) => {
  // 抓取錯誤內容的核心邏輯
  const errorMessage = error?.message || "發生未知錯誤，請稍後再試。";
  const errorDigest = error?.digest; // Next.js 產生的 Server 錯誤代碼雜湊值

  // 假設我們可以從 error 訊息中拆解或預設錯誤編號
  const errorCode = errorDigest
    ? `ERR_${errorDigest.slice(0, 6)}`
    : "500 ERROR";

  useEffect(() => {
    // 可以在這裡將錯誤發送到你的 Log 服務（例如 Sentry）
    console.error("抓取到的系統錯誤：", error);
  }, [error]);
  return (
    <>
      <Head>
        <title>{errorMessage}</title>
      </Head>
      <ErrorContainer>
        <ErrorPageClient
          errorMessage={errorMessage}
          errorDigest={errorDigest}
          errorCode={errorCode}
          reset={reset}
        />
      </ErrorContainer>
    </>
  );
};

export default Error;
