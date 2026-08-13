"use client";
import React from "react";
import styled from "styled-components";
import Head from "next/head";
import { LoadingSpinner } from "@/src/app/(components)/(loadingSpinner)/LoadingSpinner";

const LoadingContainer = styled.div`
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

const LoadingText = styled.p`
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  white-space: nowrap;
`;

const Loading = (): React.ReactElement => {
  //document.title = "載入中請稍後";
  return (
    <>
      <Head>
        <title>載入中請稍後.....</title>
      </Head>
      <LoadingContainer>
        {/* 旋轉的加載動畫 */}
        <LoadingSpinner size={100} />
        <LoadingText>Loading data...</LoadingText>
      </LoadingContainer>
    </>
  );
};

export default Loading;
