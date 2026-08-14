"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import BottomNav from "../../(components)/(bottomnav)/BottomNav";

// --- Styled Components 樣式定義 ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000000;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  padding: 3rem;
  gap: 1rem;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;

const ErrorCodeText = styled.h1`
  color: #fff;
  font-family: "Highway Gothic Expanded";
  font-size: 7.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ErrorMessageText = styled.h1`
  color: #fff;
  font-family: "Microsoft JhengHei";
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const DigestCode = styled.div`
  font-family: monospace;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #334155;
`;

// 區塊 3：按鈕控制區

const PrimaryButton = styled.button`
  display: block;
  color: #fff;
  font-family: Inter;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration: none; /* 繼承外層的刪除線或斜體 */
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  /* Hover 效果 (搭配微調邊距) */
  &:hover {
    text-decoration: underline;
    color: #2f7716; /* hover:text-green-400 */
  }
`;

// --- 組件本體 ---

export interface ErrorPageProps {
  errorMessage: string;
  errorDigest?: string; // 因為 errorDigest 有可能是 undefined，所以要加問號 ?
  errorCode: string;
  reset: () => void;
}

export default function ErrorPageClient({
  errorMessage,
  errorDigest,
  errorCode,
  reset,
}: ErrorPageProps) {
  return (
    <Container>
      {/* 1. 錯誤編號區 */}
      <ErrorCodeText>500</ErrorCodeText>

      {/* 2. 錯誤內容重點區 (重點) */}
      <ErrorMessageText>{errorMessage}</ErrorMessageText>
      {errorDigest && (
        <DigestCode>
          Digest ID: <span>{errorDigest}</span>
        </DigestCode>
      )}
      <svg
        width="363"
        height="480"
        viewBox="0 0 363 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="31" y="364" width="312" height="40" fill="#D9D9D9" />
        <rect x="31" y="436" width="312" height="40" fill="#D9D9D9" />
        <rect x="31" y="292" width="312" height="40" fill="#D9D9D9" />
        <rect x="31" y="220" width="312" height="40" fill="#D9D9D9" />
        <rect x="31" y="148" width="312" height="40" fill="#D9D9D9" />
        <rect
          y="73.5941"
          width="106"
          height="40"
          transform="rotate(-31 0 73.5941)"
          fill="#D9D9D9"
        />
        <rect
          x="262.269"
          y="19"
          width="106"
          height="40"
          transform="rotate(24 262.269 19)"
          fill="#D9D9D9"
        />
        <path
          d="M70.871 480H91V128.802L79.4258 86.3371L67.8516 66.2522L56.7806 41.0027L40.6774 0L38.6645 7.14539L33.129 4.27613V12.3101L27.5935 7.14539V17.4747L22.0581 9.4408L19.0387 17.4747L13 4.27613C13 54.6169 70.871 87.0618 70.871 128.802V480Z"
          fill="white"
        />
        <path
          d="M283 480H303V125.167L307 93.0144L322 41.9139L363 9.76077L351.5 13.2057V9.76077L345.5 13.2057L348.5 6.88995L342.5 9.76077L345.5 2.87081L342.5 4.5933V0L310 33.3014L291.5 75.7895L283 125.167V480Z"
          fill="white"
        />
      </svg>

      {/* 3. 按鈕操作區 */}
      <BottomNav />
      <PrimaryButton onClick={() => reset()}>重新嘗試 (Reset)</PrimaryButton>
    </Container>
  );
}
