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
  position: top;

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

const IconButton = styled.button`
  display: flex;
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
`;

const SearchButton = styled.button`
  display: flex;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
`;

const HighwayButton = styled.button`
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
`;

const RailwayButton = styled.button`
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
`;

const SwitchButton = styled.button`
  display: flex;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
`;

const HomeButton = styled.button`
  display: flex;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
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
      <IconButton
        type="button"
        className="component-cell-header-search"
        aria-label="搜尋"
        onClick={() => {
          console.log("點擊了Logo");
        }}
        style={{ border: "none", cursor: "pointer", backgroundSize: "cover" }}
      >
        <Image className="logo-header" src={image} alt="Logo" />
      </IconButton>

      <div className="frame">
        {/* 2. Search 區域 */}
        <SearchButton
          type="button"
          className="component-cell-header-search"
          aria-label="搜尋"
          onClick={() => {
            console.log("點擊了搜尋");
          }}
          style={{ border: "none", cursor: "pointer", backgroundSize: "cover" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M42 41.9999L33.314 33.3139M33.314 33.3139C34.7998 31.8281 35.9784 30.0643 36.7825 28.123C37.5866 26.1818 38.0005 24.1011 38.0005 21.9999C38.0005 19.8987 37.5866 17.8181 36.7825 15.8768C35.9784 13.9356 34.7998 12.1717 33.314 10.6859C31.8283 9.20015 30.0644 8.02157 28.1231 7.21747C26.1819 6.41337 24.1012 5.99951 22 5.99951C19.8988 5.99951 17.8182 6.41337 15.877 7.21747C13.9357 8.02157 12.1718 9.20015 10.686 10.6859C7.68539 13.6866 5.99963 17.7564 5.99963 21.9999C5.99963 26.2435 7.68539 30.3133 10.686 33.3139C13.6867 36.3146 17.7565 38.0003 22 38.0003C26.2436 38.0003 30.3134 36.3146 33.314 33.3139Z"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </SearchButton>

        {/* 3. 文字 wrappers */}
        <HighwayButton
          type="button"
          className="text-wrapper"
          onClick={() => {
            console.log("點擊了公路旅途");
          }}
        >
          公路旅途
        </HighwayButton>
        <RailwayButton
          type="button"
          className="text-wrapper"
          onClick={() => {
            console.log("點擊了車站旅途");
          }}
        >
          車站旅途
        </RailwayButton>

        {/* 4. Light mode switch */}
        <SwitchButton
          type="button"
          className="component-button-light-mode-switch"
          aria-label="切換模式"
          onClick={() => {
            console.log("點擊了模式切換");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M16.926 31.076C14.9753 29.1253 14 26.7667 14 24C14 21.2333 14.9753 18.8753 16.926 16.926C18.8767 14.9767 21.2347 14.0013 24 14C26.7653 13.9987 29.124 14.974 31.076 16.926C33.028 18.878 34.0027 21.236 34 24C33.9973 26.764 33.022 29.1227 31.074 31.076C29.126 33.0293 26.768 34.004 24 34C21.232 33.996 18.874 33.0207 16.926 31.074M10 26H2V22H10V26ZM46 26H38V22H46V26ZM22 10V2H26V10H22ZM22 46V38H26V46H22ZM12.8 15.5L7.75 10.65L10.6 7.7L15.4 12.7L12.8 15.5ZM37.4 40.3L32.55 35.25L35.2 32.5L40.25 37.35L37.4 40.3ZM32.5 12.8L37.35 7.75L40.3 10.6L35.3 15.4L32.5 12.8ZM7.7 37.4L12.75 32.55L15.5 35.2L10.65 40.25L7.7 37.4Z"
              fill="white"
            />
          </svg>
        </SwitchButton>

        {/* 5. Home icon */}
        <HomeButton
          type="button"
          className="icon-home"
          aria-label="回首頁"
          onClick={() => {
            console.log("點擊了首頁");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M12 38H18V28C18 27.4333 18.192 26.9587 18.576 26.576C18.96 26.1933 19.4347 26.0013 20 26H28C28.5667 26 29.042 26.192 29.426 26.576C29.81 26.96 30.0013 27.4347 30 28V38H36V20L24 11L12 20V38ZM8 38V20C8 19.3667 8.142 18.7667 8.426 18.2C8.71 17.6333 9.10133 17.1667 9.6 16.8L21.6 7.8C22.3 7.26667 23.1 7 24 7C24.9 7 25.7 7.26667 26.4 7.8L38.4 16.8C38.9 17.1667 39.292 17.6333 39.576 18.2C39.86 18.7667 40.0013 19.3667 40 20V38C40 39.1 39.608 40.042 38.824 40.826C38.04 41.61 37.0987 42.0013 36 42H28C27.4333 42 26.9587 41.808 26.576 41.424C26.1933 41.04 26.0013 40.5653 26 40V30H22V40C22 40.5667 21.808 41.042 21.424 41.426C21.04 41.81 20.5653 42.0013 20 42H12C10.9 42 9.95867 41.6087 9.176 40.826C8.39333 40.0433 8.00133 39.1013 8 38Z"
              fill="#F7F7F7"
            />
          </svg>
        </HomeButton>
      </div>
    </StyledComponentHeader>
  );
};

export default Header;
