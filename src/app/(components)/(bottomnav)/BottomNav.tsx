import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { Station, RailwayData } from "@/src/types/railway";

const Nav = styled.nav`
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0;
  margin-bottom: 1.25rem;
  gap: 3rem;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const BottomNavButton = styled.button`
  display: block;
  background: none;
  border: none;
  padding: 0;
  color: var(--text-white-aaaa);
  font-family: Inter, sans-serif;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    text-decoration: underline;
    color: var(--text-success);
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BottomNavLink = styled(Link)`
  display: block;
  color: var(--text-white-aaaa);
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
    color: var(--text-success); /* hover:text-green-400 */
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

interface BottomNavProps {
  station?: Station;
  railways?: RailwayData[];
}

export default function BottomNav({ station, railways = [] }: BottomNavProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑滾動效果
    });
  };
  return (
    <Nav aria-label="bottomnav">
      <BottomNavButton onClick={scrollToTop}>回到最上方</BottomNavButton>
      <BottomNavLink href="/">回首頁</BottomNavLink>
      <BottomNavLink href="/highways">公路旅途</BottomNavLink>
      <BottomNavLink href="/railways">車站旅途</BottomNavLink>
      {station?.line.map((line) => {
        // 1. 利用 find 找不到會回傳 undefined 的特性，搭配 || 做預設值
        const railwayName =
          railways.find((r) => Number(r.id) === Number(line.lineID))?.name ||
          `ID: ${line.lineID}`;

        return (
          <BottomNavLink key={line.lineID} href={`/railways/${line.lineID}`}>
            回{railwayName}
          </BottomNavLink>
        );
      })}
    </Nav>
  );
}
