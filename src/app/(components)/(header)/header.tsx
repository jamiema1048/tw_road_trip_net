"use client";

import React, { useState, useSyncExternalStore } from "react";
import styled from "styled-components";
import Link from "next/link";
import HeaderSearchBar from "@/src/app/(components)/(header)/HeaderSearchBar";
import { ThemeToggle } from "@/src/app/(components)/(header)/(button)/ThemeToggle";

// --- 響應式佈局調整 ---

const BREAKPOINT_MOBILE = "768px";

const StyledComponentHeader = styled.header<{ $isMenuOpen: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0.75rem 1.5rem;
  background-color: var(--bg-primary);
  box-shadow: 0px 8px 10px #ffffff40;
  box-sizing: border-box;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  gap: 0.75rem;

  @media (max-width: ${BREAKPOINT_MOBILE}) {
    flex-wrap: wrap; /* 允許手機端展開時下方內容往下推 */
    padding: 0.5rem 1.5rem;
  }
`;

const HeaderMainArea = styled.div`
  align-items: center;
  background-color: var(--bg-primary);
  display: flex;
  // height: 5rem;
  justify-content: space-between;
  position: top;
  z-index: 5;

  /* 改為自適應寬度，上限 1440px 併置中 */
  width: 100%;
  margin: 0px auto 0 auto;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* 平板尺寸適應 (<= 1024px) */
  @media (max-width: 1024px) {
    & .frame {
      gap: 24px;
    }
    & .text-wrapper {
      font-size: 28px;
    }
  }
`;

const IconButton = styled(Link)`
  display: flex;
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  @media (max-width: 768px) {
    width: 1.75rem;
    height: 1.75rem;
  }
`;

const HeaderTools = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2.5rem;
  @media (max-width: 768px) {
    gap: 1.25rem;
  }
`;

const HighwayButton = styled(Link)`
  display: flex;
  color: var(--text-white-aaa);
  font-family: "Inter-Regular", Helvetica;
  font-size: 2rem;
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
  @media (max-width: 768px) {
    display: none;
    font-size: 1.5rem;
  }
`;

const RailwayButton = styled(Link)`
  display: flex;
  color: var(--text-white-aaa);
  font-family: "Inter-Regular", Helvetica;
  font-size: 2rem;
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
  @media (max-width: 768px) {
    display: none;
    font-size: 1.5rem;
  }
`;

const HomeButton = styled(Link)`
  display: flex;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  cursor: pointer;
  @media (max-width: 768px) {
    display: none;
  }
`;

const MoreOptionButton = styled.button`
  display: none;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  cursor: pointer;
  @media (max-width: 768px) {
    display: flex;
  }
`;

/* --- 新增：動畫選單的外層容器（負責高度伸縮） --- */
const MenuContainer = styled.div<{ $isMenuOpen: boolean }>`
  display: grid;
  grid-template-rows: ${(props) => (props.$isMenuOpen ? "1fr" : "0fr")};
  transition: grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
`;

/* --- 新增：動畫選單的內層容器（負責文字與圖示的漸變顯現） --- */
const MenuContent = styled.div<{ $isMenuOpen: boolean }>`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;

  /* 透明度與位移過渡效果 */
  opacity: ${(props) => (props.$isMenuOpen ? 1 : 0)};
  transform: translateY(${(props) => (props.$isMenuOpen ? "0px" : "-10px")});
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
`;

const DropListHomeButton = styled(Link)`
  display: none;
  width: 100%;
  height: 1.5rem;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  cursor: pointer;
  @media (max-width: 768px) {
    display: flex;
  }
`;

const DropListHighwayButton = styled(Link)`
  display: none;
  color: var(--text-white-aaa);
  font-family: "Inter-Regular", Helvetica;
  font-size: 1.5rem;
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
  @media (max-width: 768px) {
    display: flex;
  }
`;

const DropListRailwayButton = styled(Link)`
  display: none;
  color: var(--text-white-aaa);
  font-family: "Inter-Regular", Helvetica;
  font-size: 1.5rem;
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
  @media (max-width: 768px) {
    display: flex;
  }
`;

export interface ComponentHeaderProps {
  device?: "desktop";
  listStatus?: "close";
  className?: string;
}

const emptySubscribe = () => () => {};

const Header: React.FC<ComponentHeaderProps> = ({ className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true, // Client 端回傳 true
    () => false, // Server 端 (SSR) 回傳 false
  );

  if (!isMounted) return null;

  return (
    <StyledComponentHeader
      className={`component-header ${className}`}
      $isMenuOpen={isMenuOpen}
    >
      <HeaderMainArea>
        {/* 1. Logo */}
        <IconButton
          href="/"
          type="button"
          className="component-cell-header-search"
          aria-label="Logo"
          onClick={closeMenu}
          style={{ border: "none", cursor: "pointer", backgroundSize: "cover" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 840 840"
            width="56"
            height="56"
            fill="none"
          >
            <path
              d="M396.37 309.5H444.37V485.5C444.37 498.755 433.625 509.5 420.37 509.5C407.115 509.5 396.37 498.755 396.37 485.5V309.5Z"
              fill={"var(--text-white-aaa)"}
            />
            <path
              d="M280.37 285.5C280.37 272.245 291.115 261.5 304.37 261.5H536.37C549.625 261.5 560.37 272.245 560.37 285.5C560.37 298.755 549.625 309.5 536.37 309.5H304.37C291.115 309.5 280.37 298.755 280.37 285.5Z"
              fill={"var(--text-white-aaa)"}
            />
            <path
              d="M278.37 655.5H562.37L491.37 524.5H349.37L278.37 655.5Z"
              fill={"var(--text-white-aaa)"}
            />
            <path
              d="M741.666 185C780.156 185 804.212 226.667 784.967 260L564.616 641.657L530.791 579.245L686.24 310C705.485 276.667 681.428 235 642.938 235H197.802C159.312 235 135.255 276.667 154.5 310L309.948 579.244L276.123 641.657L55.7733 260C36.5282 226.667 60.585 185 99.075 185H741.666Z"
              fill={"var(--text-white-aaa)"}
            />
          </svg>
        </IconButton>

        <HeaderTools>
          {/* 2. Search 區域 */}
          <HeaderSearchBar />

          {/* 3. 文字 wrappers */}
          <HighwayButton
            href="/highways"
            type="button"
            className="text-wrapper"
            onClick={closeMenu}
          >
            公路旅途
          </HighwayButton>
          <RailwayButton
            href="/railways"
            type="button"
            className="text-wrapper"
            onClick={closeMenu}
          >
            車站旅途
          </RailwayButton>

          {/* 4. Light mode switch */}
          <ThemeToggle />

          {/* 5. Home icon */}
          <HomeButton
            href="/"
            type="button"
            className="icon-home"
            aria-label="回首頁"
            onClick={closeMenu}
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
                fill={"var(--text-white-aaa)"}
              />
            </svg>
          </HomeButton>

          <MoreOptionButton
            type="button"
            className="more-option"
            aria-label="回首頁"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              /* ✕ 關閉圖示 */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke={"var(--text-white-aaa)"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* ☰ 漢堡選單圖示 */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke={"var(--text-white-aaa)"}
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4.125 18.375H19.875M4.125 12.375H19.875M4.125 6.375H19.875" />
              </svg>
            )}
          </MoreOptionButton>
        </HeaderTools>
      </HeaderMainArea>
      <MenuContainer $isMenuOpen={isMenuOpen}>
        <MenuContent $isMenuOpen={isMenuOpen}>
          <DropListHomeButton
            href="/"
            className="icon-home"
            aria-label="回首頁"
            onClick={closeMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 19H9V14C9 13.7167 9.096 13.4793 9.288 13.288C9.48 13.0967 9.71733 13.0007 10 13H14C14.2833 13 14.521 13.096 14.713 13.288C14.905 13.48 15.0007 13.7173 15 14V19H18V10L12 5.5L6 10V19ZM4 19V10C4 9.68333 4.071 9.38333 4.213 9.1C4.355 8.81667 4.55067 8.58333 4.8 8.4L10.8 3.9C11.15 3.63333 11.55 3.5 12 3.5C12.45 3.5 12.85 3.63333 13.2 3.9L19.2 8.4C19.45 8.58333 19.646 8.81667 19.788 9.1C19.93 9.38333 20.0007 9.68333 20 10V19C20 19.55 19.804 20.021 19.412 20.413C19.02 20.805 18.5493 21.0007 18 21H14C13.7167 21 13.4793 20.904 13.288 20.712C13.0967 20.52 13.0007 20.2827 13 20V15H11V20C11 20.2833 10.904 20.521 10.712 20.713C10.52 20.905 10.2827 21.0007 10 21H6C5.45 21 4.97933 20.8043 4.588 20.413C4.19667 20.0217 4.00067 19.5507 4 19Z"
                fill={"var(--text-white-aaa)"}
              />
            </svg>
          </DropListHomeButton>
          <DropListHighwayButton
            href="/highways"
            className="text-wrapper"
            onClick={closeMenu}
          >
            公路旅途
          </DropListHighwayButton>
          <DropListRailwayButton
            href="/railways"
            className="text-wrapper"
            onClick={closeMenu}
          >
            車站旅途
          </DropListRailwayButton>
        </MenuContent>
      </MenuContainer>
    </StyledComponentHeader>
  );
};

export default Header;
