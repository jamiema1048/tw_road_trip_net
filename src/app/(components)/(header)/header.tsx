"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import image from "@/public/Logo/Header.svg";

// --- 響應式佈局調整 ---
const StyledComponentHeader = styled.div`
  align-items: center;
  background-color: #090980;
  box-shadow: 0px 8px 10px #ffffff40;
  display: flex;
  min-height: 80px;
  height: auto;
  justify-content: space-between;
  padding: 11px 24px;
  position: relative;

  /* 改為自適應寬度，上限 1440px 併置中 */
  width: 100%;
  margin: 0px auto 0 auto;
  box-sizing: border-box;

  & .logo-header {
    aspect-ratio: 1 !important;
    height: 56px !important;
    position: relative !important;
    width: 56px !important;
    flex-shrink: 0;
  }

  & .frame {
    align-items: center;
    display: inline-flex;
    flex: 0 0 auto;
    gap: 40px;
    position: relative;
    flex-wrap: wrap; /* 平板與手機版過窄時允許彈性換行 */
  }

  & .component-cell-header-search {
    background-image: url(${image}) !important;
    left: unset !important;
    top: unset !important;
  }

  & .text-wrapper {
    color: #ffffff;
    font-family: "Inter-Regular", Helvetica;
    font-size: 40px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: normal;
    margin-top: -1px;
    position: relative;
    white-space: nowrap;
    width: fit-content;
    /* 為了讓按鈕看起來像文字，需要清除 button 的預設樣式 */
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  & .component-button-light-mode-switch {
    left: unset !important;
    top: unset !important;
    /* 確保按鈕有 pointer 手勢 */
    cursor: pointer;
  }

  & .icon-home {
    aspect-ratio: 1 !important;
    height: 48px !important;
    position: relative !important;
    width: 48px !important;
    /* 確保圖示按鈕有 pointer 手勢 */
    cursor: pointer;
    /* 清除按鈕預設樣式 */
    background: none;
    border: none;
    padding: 0;
  }

  /* 平板尺寸適應 (<= 1024px) */
  @media (max-width: 1024px) {
    & .frame {
      gap: 24px;
    }
    & .text-wrapper {
      font-size: 28px;
    }
  }

  /* 手機尺寸適應 (<= 768px) */
  @media (max-width: 768px) {
    padding: 12px 16px;

    & .logo-header {
      height: 40px !important;
      width: 40px !important;
    }

    & .frame {
      gap: 16px;
    }

    & .text-wrapper {
      font-size: 20px;
    }

    & .icon-home {
      height: 36px !important;
      width: 36px !important;
    }
  }
`;

export interface ComponentHeaderProps {
  device?: "desktop";
  listStatus?: "close";
  className?: string;
}

const Header: React.FC<ComponentHeaderProps> = ({ className = "" }) => {
  return (
    <StyledComponentHeader className={`component-header ${className}`}>
      {/* 1. Logo */}
      <Image className="logo-header" src={image} alt="Logo" />

      <div className="frame">
        {/* 2. Search 區域 */}
        <button
          type="button"
          className="component-cell-header-search"
          aria-label="搜尋"
          onClick={() => {
            console.log("點擊了搜尋");
          }}
          style={{ border: "none", cursor: "pointer", backgroundSize: "cover" }}
        />

        {/* 3. 文字 wrappers */}
        <button
          type="button"
          className="text-wrapper"
          onClick={() => {
            console.log("點擊了公路旅途");
          }}
        >
          公路旅途
        </button>
        <button
          type="button"
          className="text-wrapper"
          onClick={() => {
            console.log("點擊了車站旅途");
          }}
        >
          車站旅途
        </button>

        {/* 4. Light mode switch */}
        <button
          type="button"
          className="component-button-light-mode-switch"
          aria-label="切換模式"
          onClick={() => {
            console.log("點擊了模式切換");
          }}
        />

        {/* 5. Home icon */}
        <button
          type="button"
          className="icon-home"
          aria-label="回首頁"
          onClick={() => {
            console.log("點擊了首頁");
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F7F7F7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: "100%", height: "100%" }}
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>
    </StyledComponentHeader>
  );
};

export default Header;
