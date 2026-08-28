"use client";
import React, { useState, memo } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { ChevronRight, Copyright, Mail } from "lucide-react";

/* 1. 外層容器：改為最大寬度 1440px，居中並隨螢幕縮放 */
const StyledComponentFooter = styled.div`
  width: 100%;
  margin: auto auto 0 auto;
`;

/* 2. 主體區塊：改用 Padding 上下留白，替代原本死板的 height: 87.5% */
const Frame = styled.div`
  background-color: var(--bg-primary);
  width: 100%;
  padding: 2.5rem 1.5rem;
  box-sizing: border-box;

  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
    gap: 1.5rem;
  }
`;

const ContactGroup = styled.div`
  display: flex;
  justify-content: center;
`;

const ContactContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const TextWrapper = styled.p`
  color: var(--text-white-aaaa);
  font-family: "Inter-Regular", Helvetica;
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  white-space: nowrap;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StyledEmail = styled(Mail)`
  color: var(--text-white-aaaa);
  aspect-ratio: 1 !important;
  height: 1.5rem !important;
  width: 1.5rem !important;
  cursor: pointer;
`;

export const StyledGithub = styled((props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
))`
  color: var(--text-white-aaaa);
  aspect-ratio: 1 !important;
  height: 1.5rem !important;
  width: 1.5rem !important;
  cursor: pointer;
`;

/* 3. 分隔線：電腦端為豎線，手機端轉為橫線 */
const Divider = styled.div`
  background-color: var(--text-gray-a);
  height: 6rem;
  width: 1px;

  @media (max-width: 768px) {
    height: 1px;
    width: 80%;
  }
`;

const NavigationGroup = styled.div`
  display: flex;
  gap: 3rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

const NavigationColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NavigationItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
`;

const StyledBreadcrumbRight = styled(ChevronRight)`
  color: var(--text-white-aaaa);
  aspect-ratio: 1 !important;
  height: 1.25rem !important;
  width: 1.25rem !important;
`;

/* 4. 底部 Copyright 欄位：隨螢幕居中縮放 */
const BottomFrame = styled.div`
  background-color: var(--text-gray-aaa);
  width: 100%;
  padding: 0.75rem 1.5rem;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const CopyrightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CopyrightText = styled.div`
  color: var(--text-white-aaaa);
  font-family: "Inter-Regular", Helvetica;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  white-space: nowrap;
`;

const StyledCopyright = styled(Copyright)`
  color: var(--text-white-aaaa);
  aspect-ratio: 1 !important;
  height: 0.75rem !important;
  width: 0.75rem !important;
`;

const BottomDivider = styled.div`
  background-color: var(--text-gray-a);
  height: 0.75rem;
  width: 1px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TermsText = styled(Link)`
  color: var(--text-white-aaaa);
  font-family: "Inter-Regular", Helvetica;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  white-space: nowrap;
  cursor: pointer;
`;

export interface ComponentFooterProps {
  device?: "desktop";
  className?: string;
}

const ContactEmail = () => {
  const [copied, setCopied] = useState(false);
  const email = "stu1030113@gmail.com";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2秒後提示消失
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleCopy}
        aria-label="複製 Email"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <StyledEmail className="icon-instance-node" />
      </button>

      {/* 複製成功提示小氣泡 */}
      {copied && (
        <span
          style={{
            position: "absolute",
            top: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          已複製信箱！
        </span>
      )}
    </div>
  );
};

export const Footer = memo(function Footer(props: ComponentFooterProps) {
  return (
    <StyledComponentFooter className={props.className}>
      <Frame>
        <NavigationGroup>
          <NavigationColumn>
            <NavigationItem href="/about">
              <StyledBreadcrumbRight className="icon" size={16} />
              <TextWrapper>關於我們</TextWrapper>
            </NavigationItem>
            <NavigationItem href="/reference">
              <StyledBreadcrumbRight className="icon" size={16} />
              <TextWrapper>參考資料</TextWrapper>
            </NavigationItem>
          </NavigationColumn>
          <NavigationColumn>
            <NavigationItem href="/railways">
              <StyledBreadcrumbRight className="icon" size={16} />
              <TextWrapper>車站旅途</TextWrapper>
            </NavigationItem>
            <NavigationItem href="/highways">
              <StyledBreadcrumbRight className="icon" size={16} />
              <TextWrapper>公路旅途</TextWrapper>
            </NavigationItem>
          </NavigationColumn>
        </NavigationGroup>

        <Divider />

        <ContactGroup>
          <ContactContent>
            <TextWrapper>聯絡我們</TextWrapper>
            <SocialIcons>
              <ContactEmail />
              <Link
                href="https://github.com/jamiema1048"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="前往 GitHub 主頁"
              >
                <StyledGithub className="icon-instance-node" />
              </Link>
            </SocialIcons>
          </ContactContent>
        </ContactGroup>
      </Frame>

      <BottomFrame>
        <CopyrightGroup>
          <StyledCopyright className="icon-copyright" size={16} />
          <CopyrightText>All Rights Reserved</CopyrightText>
        </CopyrightGroup>
        <BottomDivider />
        <TermsText href="/terms">使用條款</TermsText>
      </BottomFrame>
    </StyledComponentFooter>
  );
});

Footer.displayName = "Footer";
