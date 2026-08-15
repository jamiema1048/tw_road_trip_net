"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

export default function SearchBar() {
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
        <SearchInputBox
          $isOpen={isOpen}
          onClick={!isOpen ? toggleOpen : undefined}
        >
          <SearchIcon
            className="logo"
            aria-label="搜尋"
            style={{ border: "none", backgroundSize: "cover" }}
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
                stroke={"var(--text-white-aaa)"}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </SearchIcon>

          {/* 動態展開的輸入框 */}
          <Input
            ref={inputRef}
            type="text"
            placeholder="搜尋公路、車站..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            $isOpen={isOpen}
          />

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
        </SearchInputBox>
        <SearchButton
          type="submit"
          className="search-submit"
          aria-label="搜尋"
          style={{ border: "none", cursor: "pointer", backgroundSize: "cover" }}
        >
          <SearchButtonText>搜尋</SearchButtonText>
        </SearchButton>
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
  background-color: ${({ $isOpen }) => ($isOpen ? "#000000" : "transparent")};
  border-radius: 9999px;
  gap: 1.5rem;
  padding: 0rem 1.25rem 0rem 1.25rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
`;

const SearchInputBox = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  background-color: var(--background);
  border: 1px solid var(--text-gray-a);
  border-radius: 0.75rem;
  padding: 0rem 0.5rem 0rem 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 35rem;
  &:hover:not(:focus-within) {
    border: 3px solid var(--text-gray-a);
  }
  &:focus-within {
    border: 1px solid var(--text-info);
    outline: none;
  }
`;

const SearchIcon = styled.div`
  display: flex;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1;
  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Input = styled.input<{ $isOpen: boolean }>`
  background: transparent;
  border: none;
  color: var(--text-white-aaaa);
  font-size: 1.5rem;
  outline: none;
  width: 100%;
  padding: 1rem 1rem;
  transition:
    opacity 0.2s ease-in-out,
    visibility 0.2s;

  &::placeholder {
    color: var(--text-gray-aa);
    text-align: start;
    font-family: Inter;
    font-size: 2.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-white-aaaa);
  font-size: 2rem;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 50%;

  &:hover {
    color: var(--text-gray-aa);
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SearchButton = styled.button<{ $isOpen: boolean }>`
  display: flex;
  padding: 0.5rem 1rem;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  transition:
    opacity 0.2s ease-in-out,
    visibility 0.2s;
  background:
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    var(-text-info);
  box-shadow:
    -2px -2px 8px 0 rgba(0, 0, 0, 0.25) inset,
    6px 6px 8px 0 rgba(0, 0, 0, 0.25) inset,
    4px 4px 4px 0 rgba(255, 255, 255, 0.25);
  &:hover {
    background:
      linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%),
      var(-text-info);
    box-shadow:
      -4px -4px 8px 0 rgba(0, 0, 0, 0.25) inset,
      8px 8px 4px 0 rgba(0, 0, 0, 0.1) inset,
      8px 8px 8px 0 rgba(255, 255, 255, 0.25);
  }

  &:active {
    background:
      linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 100%),
      var(-text-info);
    box-shadow:
      -4px -4px 8px 0 rgba(0, 0, 0, 0.25) inset,
      8px 8px 4px 0 rgba(0, 0, 0, 0.1) inset,
      8px 8px 8px 0 rgba(255, 255, 255, 0.25);
  }

  white-space: nowrap;
  flex-shrink: 0;
`;

const SearchButtonText = styled.p`
  color: var(--text-gray-a);
  font-family: Inter;
  font-size: 1.5rem;
  white-space: nowrap;
  margin: 0;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
