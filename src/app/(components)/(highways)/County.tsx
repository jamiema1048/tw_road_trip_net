"use client";
import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import Link from "next/link";
import { Highway } from "@/src/types/highway";

interface Props {
  highways: Highway[];
  loading: boolean;
  setLoading: (val: boolean) => void;
}

const STATUS_STYLES: Record<Highway["status"], ReturnType<typeof css>> = {
  active: css`
    color: var(--background);
    font-family: Inter;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    @media (prefers-color-scheme: dark) {
      color: var(--text-white-aaaa);
    }
  `,
  disused: css`
    color: var(--text-gray-aa); /* text-gray-500 */
    text-decoration: line-through;
    font-family: Inter;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  `,
  // 預設/其他狀態 (例如原本的 text-blue-400 italic)
  unlisted: css`
    color: var(--text-info); /* text-blue-400 */
    font-style: italic;
    font-family: Inter;
    font-weight: 400;
    line-height: normal;
  `,
};

const HighwayArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
`;

const HighwayAreaTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0;
`;

const HighwayAreaTitleText = styled.h2`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const NumberGroupedHighwaysTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0;
`;

const NumberGroupedHighwaysTitleText = styled.h3`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ArrowIcon = styled.svg<{ $isOpen: boolean }>`
  transition: transform 0.2s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const NumberGroupedHighways = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
`;

const GroupedHighwaysArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`;

const GroupedHighwaysLink = styled(Link)<{ $status: Highway["status"] }>`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  align-self: stretch;
  transition: all 0.2s ease-in-out;

  /* 🟢 動態套用不同狀態的樣式 */
  ${({ $status }) => STATUS_STYLES[$status] || STATUS_STYLES.active}

  &:hover {
    color: var(--text-success);
  }
`;

const HighwayIcon = styled.div`
  width: 48px;
  height: 48px;
  aspect-ratio: 1/1;
`;

const HighwayText = styled.h3`
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export default function County({ highways, loading, setLoading }: Props) {
  const [isCountyShow, setIsCountyShow] = useState(false);
  const [isCountyShowCXX, setIsCountyShowCXX] = useState(false);
  const [isCountyShowCXL, setIsCountyShowCXL] = useState(false);
  const [isCountyShowCLX, setIsCountyShowCLX] = useState(false);
  const [isCountyShowCLXXX, setIsCountyShowCLXXX] = useState(false);
  const [isCountyShowCC, setIsCountyShowCC] = useState(false);
  const [isCountyShowCCXX, setIsCountyShowCCXX] = useState(false);

  // 過濾不同段的 highways
  const section120 = highways.filter(
    (hwy) => hwy.id / 100 >= 100 && hwy.id / 100 < 121,
  );
  const section140 = highways.filter(
    (hwy) => hwy.id / 100 >= 121 && hwy.id / 100 < 141,
  );
  const section160 = highways.filter(
    (hwy) => hwy.id / 100 >= 141 && hwy.id / 100 < 161,
  );
  const section180 = highways.filter(
    (hwy) => hwy.id / 100 >= 161 && hwy.id / 100 < 181,
  );
  const section200 = highways.filter(
    (hwy) => hwy.id / 100 >= 181 && hwy.id / 100 < 201,
  );
  const section220 = highways.filter(
    (hwy) => hwy.id / 100 >= 201 && hwy.id / 100 < 221,
  );

  const groupByPrefix = (section: Highway[]) => {
    const grouped: Record<number, Highway[]> = {};
    section.forEach((h) => {
      const prefix = Math.floor(h.id / 100);
      if (!grouped[prefix]) grouped[prefix] = [];
      grouped[prefix].push(h);
    });
    return grouped;
  };

  const renderGroupedHighways = (section: Highway[]) => {
    // 1. 先對整體資料依照 id 進行升冪排序 (1, 2, 3...)
    const sortedSection = [...section].sort((a, b) => a.id - b.id);

    // 2. 進行分組
    const grouped = groupByPrefix(sortedSection);

    // 3. 轉成陣列並針對每個 Group 內部的 highways 確保順序正確
    return (
      Object.entries(grouped)
        // 可選：如果你希望「組別 (prefix)」本身也按 id 排序，可以在此對 entries 排序
        .sort(
          ([, aHighways], [, bHighways]) => aHighways[0].id - bHighways[0].id,
        )
        .map(([prefix, highways]) => {
          // 確保該組內的公路也是照 id 排序
          const sortedHighwaysInGroup = [...highways].sort(
            (a, b) => a.id - b.id,
          );

          return (
            <GroupedHighwaysArea key={prefix}>
              {sortedHighwaysInGroup.map((hwy) => (
                <GroupedHighwaysLink
                  key={hwy.id}
                  href={`/highways/${hwy.id}`}
                  $status={hwy.status}
                >
                  <HighwayIcon />
                  <HighwayText>{hwy.name}</HighwayText>
                </GroupedHighwaysLink>
              ))}
            </GroupedHighwaysArea>
          );
        })
    );
  };

  return (
    <HighwayArea id="county" data-testid="county">
      <HighwayAreaTitle onClick={() => setIsCountyShow((prev) => !prev)}>
        <HighwayAreaTitleText>縣市道</HighwayAreaTitleText>
        <ArrowIcon
          $isOpen={isCountyShow}
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25.414 31.414C25.039 31.7889 24.5303 31.9995 24 31.9995C23.4697 31.9995 22.9611 31.7889 22.586 31.414L11.272 20.1C11.081 19.9155 10.9286 19.6948 10.8238 19.4508C10.719 19.2068 10.6638 18.9443 10.6615 18.6788C10.6592 18.4132 10.7098 18.1498 10.8104 17.904C10.9109 17.6583 11.0594 17.4349 11.2472 17.2472C11.435 17.0594 11.6583 16.9109 11.9041 16.8103C12.1499 16.7097 12.4133 16.6591 12.6788 16.6615C12.9444 16.6638 13.2068 16.7189 13.4508 16.8238C13.6948 16.9286 13.9155 17.0809 14.1 17.272L24 27.172L33.9 17.272C34.2772 16.9076 34.7824 16.706 35.3068 16.7106C35.8312 16.7152 36.3328 16.9255 36.7037 17.2963C37.0745 17.6671 37.2848 18.1688 37.2894 18.6932C37.2939 19.2175 37.0923 19.7227 36.728 20.1L25.414 31.414Z"
            fill={"var(--text-white-aaaa)"}
          />
        </ArrowIcon>
      </HighwayAreaTitle>

      {isCountyShow && (
        <>
          <NumberGroupedHighways>
            <NumberGroupedHighwaysTitle
              onClick={() => setIsCountyShowCXX((prev) => !prev)}
            >
              <NumberGroupedHighwaysTitleText>
                101~120
              </NumberGroupedHighwaysTitleText>
              <ArrowIcon
                $isOpen={isCountyShowCXX}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.9427 20.9427C16.6926 21.1927 16.3535 21.3331 16 21.3331C15.6464 21.3331 15.3074 21.1927 15.0573 20.9427L7.51466 13.4001C7.38731 13.2771 7.28573 13.1299 7.21585 12.9673C7.14598 12.8046 7.10919 12.6296 7.10766 12.4526C7.10612 12.2755 7.13985 12.1 7.20689 11.9361C7.27394 11.7723 7.37294 11.6234 7.49813 11.4982C7.62332 11.373 7.77219 11.274 7.93605 11.207C8.09991 11.1399 8.27549 11.1062 8.45252 11.1077C8.62956 11.1093 8.80452 11.146 8.9672 11.2159C9.12987 11.2858 9.27699 11.3874 9.39999 11.5147L16 18.1147L22.6 11.5147C22.8515 11.2718 23.1883 11.1374 23.5379 11.1405C23.8875 11.1435 24.2219 11.2837 24.4691 11.531C24.7163 11.7782 24.8565 12.1126 24.8596 12.4622C24.8626 12.8118 24.7282 13.1486 24.4853 13.4001L16.9427 20.9427Z"
                  fill={"var(--text-white-aaaa)"}
                />
              </ArrowIcon>
            </NumberGroupedHighwaysTitle>
            {isCountyShowCXX && (
              <NumberGroupedHighways>
                {section120.length > 0
                  ? renderGroupedHighways(section120)
                  : "No highways found"}
              </NumberGroupedHighways>
            )}
          </NumberGroupedHighways>

          <NumberGroupedHighways>
            <NumberGroupedHighwaysTitle
              onClick={() => setIsCountyShowCXL((prev) => !prev)}
            >
              <NumberGroupedHighwaysTitleText>
                121~140
              </NumberGroupedHighwaysTitleText>
              <ArrowIcon
                $isOpen={isCountyShowCXL}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.9427 20.9427C16.6926 21.1927 16.3535 21.3331 16 21.3331C15.6464 21.3331 15.3074 21.1927 15.0573 20.9427L7.51466 13.4001C7.38731 13.2771 7.28573 13.1299 7.21585 12.9673C7.14598 12.8046 7.10919 12.6296 7.10766 12.4526C7.10612 12.2755 7.13985 12.1 7.20689 11.9361C7.27394 11.7723 7.37294 11.6234 7.49813 11.4982C7.62332 11.373 7.77219 11.274 7.93605 11.207C8.09991 11.1399 8.27549 11.1062 8.45252 11.1077C8.62956 11.1093 8.80452 11.146 8.9672 11.2159C9.12987 11.2858 9.27699 11.3874 9.39999 11.5147L16 18.1147L22.6 11.5147C22.8515 11.2718 23.1883 11.1374 23.5379 11.1405C23.8875 11.1435 24.2219 11.2837 24.4691 11.531C24.7163 11.7782 24.8565 12.1126 24.8596 12.4622C24.8626 12.8118 24.7282 13.1486 24.4853 13.4001L16.9427 20.9427Z"
                  fill={"var(--text-white-aaaa)"}
                />
              </ArrowIcon>
            </NumberGroupedHighwaysTitle>
            {isCountyShowCXL && (
              <NumberGroupedHighways>
                {section140.length > 0
                  ? renderGroupedHighways(section140)
                  : "No highways found"}
              </NumberGroupedHighways>
            )}
          </NumberGroupedHighways>
          <NumberGroupedHighways>
            <NumberGroupedHighwaysTitle
              onClick={() => setIsCountyShowCLX((prev) => !prev)}
            >
              <NumberGroupedHighwaysTitleText>
                141~160
              </NumberGroupedHighwaysTitleText>
              <ArrowIcon
                $isOpen={isCountyShowCLX}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.9427 20.9427C16.6926 21.1927 16.3535 21.3331 16 21.3331C15.6464 21.3331 15.3074 21.1927 15.0573 20.9427L7.51466 13.4001C7.38731 13.2771 7.28573 13.1299 7.21585 12.9673C7.14598 12.8046 7.10919 12.6296 7.10766 12.4526C7.10612 12.2755 7.13985 12.1 7.20689 11.9361C7.27394 11.7723 7.37294 11.6234 7.49813 11.4982C7.62332 11.373 7.77219 11.274 7.93605 11.207C8.09991 11.1399 8.27549 11.1062 8.45252 11.1077C8.62956 11.1093 8.80452 11.146 8.9672 11.2159C9.12987 11.2858 9.27699 11.3874 9.39999 11.5147L16 18.1147L22.6 11.5147C22.8515 11.2718 23.1883 11.1374 23.5379 11.1405C23.8875 11.1435 24.2219 11.2837 24.4691 11.531C24.7163 11.7782 24.8565 12.1126 24.8596 12.4622C24.8626 12.8118 24.7282 13.1486 24.4853 13.4001L16.9427 20.9427Z"
                  fill={"var(--text-white-aaaa)"}
                />
              </ArrowIcon>
            </NumberGroupedHighwaysTitle>
            {isCountyShowCLX && (
              <NumberGroupedHighways>
                {section160.length > 0
                  ? renderGroupedHighways(section160)
                  : "No highways found"}
              </NumberGroupedHighways>
            )}
          </NumberGroupedHighways>
          <NumberGroupedHighways>
            <NumberGroupedHighwaysTitle
              onClick={() => setIsCountyShowCLXXX((prev) => !prev)}
            >
              <NumberGroupedHighwaysTitleText>
                161~180
              </NumberGroupedHighwaysTitleText>
              <ArrowIcon
                $isOpen={isCountyShowCLXXX}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.9427 20.9427C16.6926 21.1927 16.3535 21.3331 16 21.3331C15.6464 21.3331 15.3074 21.1927 15.0573 20.9427L7.51466 13.4001C7.38731 13.2771 7.28573 13.1299 7.21585 12.9673C7.14598 12.8046 7.10919 12.6296 7.10766 12.4526C7.10612 12.2755 7.13985 12.1 7.20689 11.9361C7.27394 11.7723 7.37294 11.6234 7.49813 11.4982C7.62332 11.373 7.77219 11.274 7.93605 11.207C8.09991 11.1399 8.27549 11.1062 8.45252 11.1077C8.62956 11.1093 8.80452 11.146 8.9672 11.2159C9.12987 11.2858 9.27699 11.3874 9.39999 11.5147L16 18.1147L22.6 11.5147C22.8515 11.2718 23.1883 11.1374 23.5379 11.1405C23.8875 11.1435 24.2219 11.2837 24.4691 11.531C24.7163 11.7782 24.8565 12.1126 24.8596 12.4622C24.8626 12.8118 24.7282 13.1486 24.4853 13.4001L16.9427 20.9427Z"
                  fill={"var(--text-white-aaaa)"}
                />
              </ArrowIcon>
            </NumberGroupedHighwaysTitle>
            {isCountyShowCLXXX && (
              <NumberGroupedHighways>
                {section180.length > 0
                  ? renderGroupedHighways(section180)
                  : "No highways found"}
              </NumberGroupedHighways>
            )}
          </NumberGroupedHighways>
          <NumberGroupedHighways>
            <NumberGroupedHighwaysTitle
              onClick={() => setIsCountyShowCC((prev) => !prev)}
            >
              <NumberGroupedHighwaysTitleText>
                181~200
              </NumberGroupedHighwaysTitleText>
              <ArrowIcon
                $isOpen={isCountyShowCC}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.9427 20.9427C16.6926 21.1927 16.3535 21.3331 16 21.3331C15.6464 21.3331 15.3074 21.1927 15.0573 20.9427L7.51466 13.4001C7.38731 13.2771 7.28573 13.1299 7.21585 12.9673C7.14598 12.8046 7.10919 12.6296 7.10766 12.4526C7.10612 12.2755 7.13985 12.1 7.20689 11.9361C7.27394 11.7723 7.37294 11.6234 7.49813 11.4982C7.62332 11.373 7.77219 11.274 7.93605 11.207C8.09991 11.1399 8.27549 11.1062 8.45252 11.1077C8.62956 11.1093 8.80452 11.146 8.9672 11.2159C9.12987 11.2858 9.27699 11.3874 9.39999 11.5147L16 18.1147L22.6 11.5147C22.8515 11.2718 23.1883 11.1374 23.5379 11.1405C23.8875 11.1435 24.2219 11.2837 24.4691 11.531C24.7163 11.7782 24.8565 12.1126 24.8596 12.4622C24.8626 12.8118 24.7282 13.1486 24.4853 13.4001L16.9427 20.9427Z"
                  fill={"var(--text-white-aaaa)"}
                />
              </ArrowIcon>
            </NumberGroupedHighwaysTitle>
            {isCountyShowCC && (
              <NumberGroupedHighways>
                {section200.length > 0
                  ? renderGroupedHighways(section200)
                  : "No highways found"}
              </NumberGroupedHighways>
            )}
          </NumberGroupedHighways>
          <NumberGroupedHighways>
            <NumberGroupedHighwaysTitle
              onClick={() => setIsCountyShowCCXX((prev) => !prev)}
            >
              <NumberGroupedHighwaysTitleText>
                201~
              </NumberGroupedHighwaysTitleText>
              <ArrowIcon
                $isOpen={isCountyShowCCXX}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.9427 20.9427C16.6926 21.1927 16.3535 21.3331 16 21.3331C15.6464 21.3331 15.3074 21.1927 15.0573 20.9427L7.51466 13.4001C7.38731 13.2771 7.28573 13.1299 7.21585 12.9673C7.14598 12.8046 7.10919 12.6296 7.10766 12.4526C7.10612 12.2755 7.13985 12.1 7.20689 11.9361C7.27394 11.7723 7.37294 11.6234 7.49813 11.4982C7.62332 11.373 7.77219 11.274 7.93605 11.207C8.09991 11.1399 8.27549 11.1062 8.45252 11.1077C8.62956 11.1093 8.80452 11.146 8.9672 11.2159C9.12987 11.2858 9.27699 11.3874 9.39999 11.5147L16 18.1147L22.6 11.5147C22.8515 11.2718 23.1883 11.1374 23.5379 11.1405C23.8875 11.1435 24.2219 11.2837 24.4691 11.531C24.7163 11.7782 24.8565 12.1126 24.8596 12.4622C24.8626 12.8118 24.7282 13.1486 24.4853 13.4001L16.9427 20.9427Z"
                  fill={"var(--text-white-aaaa)"}
                />
              </ArrowIcon>
            </NumberGroupedHighwaysTitle>
            {isCountyShowCCXX && (
              <NumberGroupedHighways>
                {section220.length > 0
                  ? renderGroupedHighways(section220)
                  : "No highways found"}
              </NumberGroupedHighways>
            )}
          </NumberGroupedHighways>
        </>
      )}
    </HighwayArea>
  );
}
