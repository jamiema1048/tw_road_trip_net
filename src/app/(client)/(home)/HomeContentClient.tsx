"use client";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import TempImg from "@/public/Logo/Header.png";

const HomeContainer = styled.div`
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  overflow-y: auto; /* 超出螢幕高度時出現滾動條 */
`;

const ContentWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
  flex: 1;
`;

const Title = styled.h1`
  color: var(--text-white-aaaa);
  font-family: "Inter-Regular", Helvetica;
  font-size: clamp(32px, 5vw, 60px);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.2;
  margin-top: 48px;
  text-align: center;
  width: 100%;
  max-width: 720px;
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Description = styled.div`
  color: var(--text-white-aaaa);
  font-family: "Inter-Regular", Helvetica;
  font-size: clamp(18px, 2.5vw, 32px);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.6;
  margin-top: clamp(32px, 5vw, 72px);
  text-align: center;
  width: 100%;
  max-width: 945px;
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Divider = styled.div`
  background-color: var(--text-white-aaaa);
  height: 1px;
  margin-top: 48px;
  width: 100%;
  max-width: 1200px;
`;

const JourneyCards = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(32px, 6vw, 120px);
  margin-top: 72px;
  margin-bottom: 72px;
  width: 100%;
  max-width: 840px;
  flex-wrap: wrap; /* 手機板自動換行豎排 */
`;

const StationJourneyCard = styled(Link)`
  aspect-ratio: 1;
  background-color: var(--text-white-aaaa);
  border-radius: 24px;
  box-shadow:
    8px 8px 4px #ffffff40,
    inset -4px 4px 4px #ffffff40;
  width: min(100%, 360px);
  overflow: hidden;
  position: relative;

  /* 🟢 確保 Link 是塊級元素，且游標顯示為手型 */
  display: block;
  cursor: pointer;
  text-decoration: none;
`;

const StationJourneyImage = styled(Image)`
  /* 🟢 移除 aspect-ratio，讓圖片貼滿卡片 */
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1; /* 確保在背景層 */

  /* 🟢 關鍵：讓圖片不攔截點擊事件，直接穿透給外層的 <Link> */
  pointer-events: none;
`;

const StationJourneyLabel = styled.div`
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 400;
  left: 10%;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 70%;
  white-space: nowrap;
  z-index: 2; /* 確保文字浮在圖片上方 */

  /* 🟢 讓文字也不會阻擋點擊 */
  pointer-events: none;
`;

const RoadJourneyCard = styled(Link)`
  aspect-ratio: 1;
  background-color: var(--text-white-aaaa);
  border-radius: 24px;
  box-shadow:
    8px 8px 4px #ffffff40,
    inset -4px 4px 4px #ffffff40;
  width: min(100%, 360px);
  overflow: hidden;
  position: relative;

  /* 🟢 確保 Link 是塊級元素，且游標顯示為手型 */
  display: block;
  cursor: pointer;
  text-decoration: none;
`;

const RoadJourneyImage = styled(Image)`
  /* 🟢 移除 aspect-ratio，讓圖片貼滿卡片 */
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1; /* 確保在背景層 */

  /* 🟢 關鍵：讓圖片不攔截點擊事件，直接穿透給外層的 <Link> */
  pointer-events: none;
`;

const RoadJourneyLabel = styled.div`
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 400;
  left: 10%;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 70%;
  white-space: nowrap;
  z-index: 2; /* 確保文字浮在圖片上方 */

  /* 🟢 讓文字也不會阻擋點擊 */
  pointer-events: none;
`;

export default function HomeContentClient(): React.ReactElement {
  return (
    <HomeContainer>
      <ContentWrapper>
        <Title>來場探索台灣交通的旅途吧</Title>
        <Description>
          小時候翻開地圖，心裡不禁疑問著，鐵路和公路，真的只有這些嗎?
          <br />
          意外找到了地圖上沒出現的廢棄火車站，讓我更篤定答案不只如此
          <br />
          揹起背包，就踏上了這條不回頭尋找答案的旅途了
        </Description>
        <Divider />
        <JourneyCards>
          <StationJourneyCard href="/railways">
            <StationJourneyImage
              alt="車站旅途"
              src={TempImg}
              priority
              sizes="(max-width: 768px) 100vw, 360px"
            />
            <StationJourneyLabel>車站旅途</StationJourneyLabel>
          </StationJourneyCard>
          <RoadJourneyCard href="/highways">
            <RoadJourneyImage
              alt="公路旅途"
              src={TempImg}
              priority
              sizes="(max-width: 768px) 100vw, 360px"
            />
            <RoadJourneyLabel>公路旅途</RoadJourneyLabel>
          </RoadJourneyCard>
        </JourneyCards>
      </ContentWrapper>
    </HomeContainer>
  );
}
