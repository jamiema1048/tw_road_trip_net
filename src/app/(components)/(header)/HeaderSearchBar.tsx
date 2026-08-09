"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled, { css } from "styled-components";

export default function HeaderSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 控制搜尋框開關狀態
  const [isOpen, setIsOpen] = useState(false);
  // 輸入關鍵字
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. 當展開時，自動聚焦 input
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // 2. 點擊元件外部區域 (Click Outside) 或按下 Esc 鍵時自動收合
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (!keyword.trim()) {
          setIsOpen(false);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyword]);

  // 處理提交搜尋
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
  };

  // 切換展開/收合
  const toggleOpen = () => {
    if (isOpen && !keyword.trim()) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <SearchContainer ref={containerRef}>
      <Form onSubmit={handleSearch} $isOpen={isOpen}>
        {/* 放大鏡按鈕 (未展開時顯示，展開時作為提交按鈕) */}
        <SearchIconButton
          type={isOpen ? "submit" : "button"}
          onClick={!isOpen ? toggleOpen : undefined}
          aria-label="搜尋"
        >
          🔍
        </SearchIconButton>

        {/* 動態展開的輸入框 */}
        <Input
          ref={inputRef}
          type="text"
          placeholder="搜尋公路、車站..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          $isOpen={isOpen}
        />

        {/* 展開時顯示的清除/關閉按鈕 */}
        {isOpen && (
          <CloseButton
            type="button"
            onClick={() => {
              setKeyword("");
              setIsOpen(false);
            }}
            aria-label="關閉搜尋"
          >
            ✕
          </CloseButton>
        )}
      </Form>
    </SearchContainer>
  );
}

/* Styled Components */

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Form = styled.form<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  background-color: ${({ $isOpen }) => ($isOpen ? "#1a1a1a" : "transparent")};
  border: 1px solid ${({ $isOpen }) => ($isOpen ? "#333333" : "transparent")};
  border-radius: 9999px;
  padding: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: ${({ $isOpen }) => ($isOpen ? "260px" : "36px")};

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      &:focus-within {
        border-color: #2f7716;
        box-shadow: 0 0 0 2px rgba(47, 119, 22, 0.2);
      }
    `}

  @media (min-width: 640px) {
    width: ${({ $isOpen }) => ($isOpen ? "320px" : "36px")};
  }
`;

const SearchIconButton = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-size: 16px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Input = styled.input<{ $isOpen: boolean }>`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  width: 100%;
  padding: 0 8px;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  transition:
    opacity 0.2s ease-in-out,
    visibility 0.2s;

  &::placeholder {
    color: #888888;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #888888;
  font-size: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 50%;

  &:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
