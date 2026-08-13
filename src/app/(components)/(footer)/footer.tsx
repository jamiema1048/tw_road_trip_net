"use client";
import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { Icon } from "@iconify/react";

/* 1. 外層容器：改為最大寬度 1440px，居中並隨螢幕縮放 */
const StyledComponentFooter = styled.div`
  width: 100%;
  margin: auto auto 0 auto;
  position: bottom;
`;

/* 2. 主體區塊：改用 Padding 上下留白，替代原本死板的 height: 87.5% */
const Frame = styled.div`
  background-color: #090980;
  width: 100%;
  padding: 40px 24px;
  box-sizing: border-box;

  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 32px;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    align-items: center;
    gap: 24px;
  }
`;

const ContactGroup = styled.div`
  display: flex;
  justify-content: center;
`;

const ContactContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const TextWrapper = styled.div`
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

const SocialIcons = styled.div`
  display: flex;
  gap: 24px;
`;

const StyledEmail = styled(Icon)`
  aspect-ratio: 1 !important;
  height: 24px !important;
  width: 24px !important;
  cursor: pointer;
`;

const StyledGithub = styled(Icon)`
  aspect-ratio: 1 !important;
  height: 24px !important;
  width: 24px !important;
  cursor: pointer;
`;

/* 3. 分隔線：電腦端為豎線，手機端轉為橫線 */
const Divider = styled.div`
  background-color: #d9d9d9;
  height: 100px;
  width: 1px;

  @media (max-width: 768px) {
    height: 1px;
    width: 80%;
  }
`;

const NavigationGroup = styled.div`
  display: flex;
  gap: 48px;

  @media (max-width: 480px) {
    gap: 24px;
  }
`;

const NavigationColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const NavigationItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

const StyledBreadcrumbRight = styled(Icon)`
  aspect-ratio: 1 !important;
  height: 20px !important;
  width: 20px !important;
`;

/* 4. 底部 Copyright 欄位：隨螢幕居中縮放 */
const BottomFrame = styled.div`
  background-color: #343434;
  width: 100%;
  padding: 12px 24px;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const CopyrightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CopyrightText = styled.div`
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  white-space: nowrap;
`;

const StyledCopyright = styled(Icon)`
  aspect-ratio: 1 !important;
  height: 12px !important;
  width: 12px !important;
`;

const BottomDivider = styled.div`
  background-color: #d9d9d9;
  height: 12px;
  width: 1px;

  @media (max-width: 480px) {
    display: none;
  }
`;

const TermsText = styled(Link)`
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: 12px;
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
  const email = "stu1030113@gmail.co";

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
        <StyledEmail
          icon="mdi:email-outline"
          className="icon-instance-node"
          color="white"
        />
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

const Footer: React.FC<ComponentFooterProps> = () => {
  return (
    <StyledComponentFooter>
      <Frame>
        <NavigationGroup>
          <NavigationColumn>
            <NavigationItem href="/about">
              <StyledBreadcrumbRight
                icon="mdi:chevron-right"
                className="icon"
                color="white"
              />
              <TextWrapper>關於我們</TextWrapper>
            </NavigationItem>
            <NavigationItem href="/reference">
              <StyledBreadcrumbRight
                icon="mdi:chevron-right"
                className="icon"
                color="white"
              />
              <TextWrapper>參考資料</TextWrapper>
            </NavigationItem>
          </NavigationColumn>
          <NavigationColumn>
            <NavigationItem href="/railways">
              <StyledBreadcrumbRight
                icon="mdi:chevron-right"
                className="icon"
                color="white"
              />
              <TextWrapper>車站旅途</TextWrapper>
            </NavigationItem>
            <NavigationItem href="/highways">
              <StyledBreadcrumbRight
                icon="mdi:chevron-right"
                className="icon"
                color="white"
              />
              <TextWrapper>公路旅途</TextWrapper>
            </NavigationItem>
          </NavigationColumn>
        </NavigationGroup>

        <Divider />

        <ContactGroup>
          <ContactContent>
            <TextWrapper>聯絡我們</TextWrapper>
            <SocialIcons>
              {/* 1. Email 連結：使用 mailto: 觸發郵件軟體 */}
              <ContactEmail />
              {/* 2. GitHub 連結：使用外部連結 */}
              <Link
                href="https://github.com/jamiema1048"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="前往 GitHub 主頁"
              >
                <StyledGithub
                  icon="mdi:github"
                  className="icon-instance-node"
                  color="white"
                />
              </Link>
            </SocialIcons>
          </ContactContent>
        </ContactGroup>
      </Frame>

      <BottomFrame>
        <CopyrightGroup>
          <StyledCopyright
            icon="mdi:copyright"
            className="icon-copyright"
            color="white"
          />
          <CopyrightText>All Rights Reserved</CopyrightText>
        </CopyrightGroup>
        <BottomDivider />
        <TermsText href="/terms">使用條款</TermsText>
      </BottomFrame>
    </StyledComponentFooter>
  );
};

export default Footer;
