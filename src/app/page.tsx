"use client";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import TempImg from "@/public/Logo/Header.png";
import Header from "./(components)/(header)/header";
import Footer from "./(components)/(footer)/footer";

const HomeContainer = styled.div`
  background-color: #000000;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
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
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: clamp(32px, 5vw, 60px);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.2;
  margin-top: 48px;
  text-align: center;
  width: 100%;
  max-width: 720px;
`;

const Description = styled.div`
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: clamp(18px, 2.5vw, 32px);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.6;
  margin-top: clamp(32px, 5vw, 72px);
  text-align: center;
  width: 100%;
  max-width: 945px;
`;

const Divider = styled.div`
  background-color: #ffffff;
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

const StationJourneyCard = styled.div`
  aspect-ratio: 1;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow:
    8px 8px 12px #ffffff40,
    inset -4px -4px 4px #ffffff40;
  height: auto;
  width: min(100%, 360px);
  overflow: hidden;
  position: relative;
`;

const StationJourneyImage = styled(Image)`
  aspect-ratio: 0.75;
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  left: 0;
  top: 0;
`;

const StationJourneyLabel = styled.div`
  color: var(--textwhiteaaaa, #ffffff);
  font-family: "Inter-Regular", Helvetica;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 400;
  left: 10%;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 70%;
  white-space: nowrap;
`;

const RoadJourneyCard = styled.div`
  aspect-ratio: 1;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow:
    8px 8px 4px #ffffff40,
    inset -4px 4px 4px #ffffff40;
  height: auto;
  width: min(100%, 360px);
  overflow: hidden;
  position: relative;
`;

const RoadJourneyImage = styled(Image)`
  aspect-ratio: 1.33;
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  left: 0;
  top: 0;
`;

const RoadJourneyLabel = styled.div`
  color: var(--textwhiteaaaa, #ffffff);
  font-family: "Inter-Regular", Helvetica;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 400;
  left: 10%;
  letter-spacing: 0;
  line-height: normal;
  position: absolute;
  top: 70%;
  white-space: nowrap;
`;

export default function HomePage(): React.ReactElement {
  return (
    <HomeContainer>
      <Header />
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
          <StationJourneyCard>
            <StationJourneyImage alt="車站旅途" src={TempImg} />
            <StationJourneyLabel>車站旅途</StationJourneyLabel>
          </StationJourneyCard>
          <RoadJourneyCard>
            <RoadJourneyImage alt="公路旅途" src={TempImg} />
            <RoadJourneyLabel>公路旅途</RoadJourneyLabel>
          </RoadJourneyCard>
        </JourneyCards>
      </ContentWrapper>
      <Footer />
    </HomeContainer>
  );
}
