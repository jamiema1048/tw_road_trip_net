// src/app/highways/Province.tsx
"use client";

import { useState, useMemo, useTransition } from "react";
import styled, { css } from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { Highway } from "@/src/types/highway";

interface Props {
  highways: Highway[];
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
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }
`;

const HighwayAreaTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0;
`;

const TitleArrowIcon = styled.svg<{ $isOpen: boolean }>`
  transition: transform 0.2s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  width: 3rem;
  height: 3rem;
  @media (max-width: 768px) {
    width: 2.25rem;
    height: 2.25rem;
  }
`;

const HighwayAreaTitleText = styled.h2`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
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
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NumberTitleArrowIcon = styled.svg<{ $isOpen: boolean }>`
  transition: transform 0.2s ease-in-out;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  width: 2rem;
  height: 2rem;
  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const NumberGroupedHighways = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  align-self: stretch;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const GroupedHighwaysArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const GroupedHighwaysLink = styled(Link)<{ $status: Highway["status"] }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  /* 🟢 動態套用不同狀態的樣式 */
  ${({ $status }) => STATUS_STYLES[$status] || STATUS_STYLES.active}

  &:hover {
    color: var(--text-success);
  }
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const HighwayIcon = styled(Image).attrs({
  width: 48, // 3rem 對應 48px
  height: 48,
})`
  width: 3rem;
  height: 3rem;
  aspect-ratio: 1/1;
  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
  }
`;

const HighwayText = styled.h3`
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

// 1. 簡化後的分組與渲染 Helper（移除多餘的二次 / 三次 sort）
const renderGroupedHighways = (section: Highway[]) => {
  // 只需要全域升冪排序一次
  const sortedSection = [...section].sort((a, b) => a.id - b.id);

  // 進行單次迭代分組
  const grouped: Record<string, Highway[]> = {};
  sortedSection.forEach((hwy) => {
    const prefix = Math.floor(hwy.id / 100).toString();
    if (!grouped[prefix]) grouped[prefix] = [];
    grouped[prefix].push(hwy); // 壓入時已保持 sorted 順序
  });

  return Object.entries(grouped).map(([prefix, highwaysInGroup]) => (
    <GroupedHighwaysArea key={prefix}>
      {highwaysInGroup.map((hwy) => (
        <GroupedHighwaysLink
          key={hwy.id}
          href={`/highways/${hwy.id}`}
          $status={hwy.status}
        >
          <HighwayIcon
            src={hwy.highwayIcon || `/highway_mark/${hwy.id}/${hwy.id}.svg`}
            alt={`${hwy.name} 圖示`}
            className="object-contain"
          />
          <HighwayText>{hwy.name}</HighwayText>
        </GroupedHighwaysLink>
      ))}
    </GroupedHighwaysArea>
  ));
};

export default function Province({ highways }: Props) {
  const [isProvinceShow, setIsProvinceShow] = useState(false);
  const [isProvinceShowXX, setIsProvinceShowXX] = useState(false);
  const [isProvinceShowC, setIsProvinceShowC] = useState(false);

  // 2. 引入 useTransition 優化 INP
  const [isPending, startTransition] = useTransition();

  // 包裝 State 切換，讓 UI 展開渲染成為 Non-urgent Task
  const toggleProvince = () => {
    startTransition(() => setIsProvinceShow((prev) => !prev));
  };

  const toggleProvinceXX = () => {
    startTransition(() => setIsProvinceShowXX((prev) => !prev));
  };

  const toggleProvinceC = () => {
    startTransition(() => setIsProvinceShowC((prev) => !prev));
  };

  // 3. 使用 useMemo 快取過濾與分組結果
  const section420 = useMemo(
    () => highways.filter((hwy) => hwy.id / 100 >= 400 && hwy.id / 100 < 421),
    [highways],
  );

  const section440 = useMemo(
    () => highways.filter((hwy) => hwy.id / 100 >= 421 && hwy.id / 100 < 500),
    [highways],
  );

  const content420 = useMemo(
    () =>
      section420.length > 0
        ? renderGroupedHighways(section420)
        : "No highways found",
    [section420],
  );

  const content440 = useMemo(
    () =>
      section440.length > 0
        ? renderGroupedHighways(section440)
        : "No highways found",
    [section440],
  );

  console.log("Province rendered!");

  return (
    <HighwayArea
      id="province"
      data-testid="province"
      style={{ opacity: isPending ? 0.7 : 1, transition: "opacity 0.15s" }}
    >
      <HighwayAreaTitle onClick={toggleProvince}>
        <HighwayAreaTitleText>省道</HighwayAreaTitleText>
        <TitleArrowIcon
          $isOpen={isProvinceShow}
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
        </TitleArrowIcon>
      </HighwayAreaTitle>

      {isProvinceShow && (
        <>
          <NumberGroupedHighways>
            <NumberGroupedHighwaysTitle onClick={toggleProvinceXX}>
              <NumberGroupedHighwaysTitleText>
                1~20
              </NumberGroupedHighwaysTitleText>
              <NumberTitleArrowIcon
                $isOpen={isProvinceShowXX}
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
              </NumberTitleArrowIcon>
            </NumberGroupedHighwaysTitle>

            {isProvinceShowXX && (
              <NumberGroupedHighways>{content420}</NumberGroupedHighways>
            )}
          </NumberGroupedHighways>

          <NumberGroupedHighways>
            <NumberGroupedHighwaysTitle onClick={toggleProvinceC}>
              <NumberGroupedHighwaysTitleText>
                21~
              </NumberGroupedHighwaysTitleText>
              <NumberTitleArrowIcon
                $isOpen={isProvinceShowC}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="48"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.9427 20.9427C16.6926 21.1927 16.3535 21.3331 16 21.3331C15.6464 21.3331 15.3074 21.1927 15.0573 20.9427L7.51466 13.4001C7.38731 13.2771 7.28573 13.1299 7.21585 12.9673C7.14598 12.8046 7.10919 12.6296 7.10766 12.4526C7.10612 12.2755 7.13985 12.1 7.20689 11.9361C7.27394 11.7723 7.37294 11.6234 7.49813 11.4982C7.62332 11.373 7.77219 11.274 7.93605 11.207C8.09991 11.1399 8.27549 11.1062 8.45252 11.1077C8.62956 11.1093 8.80452 11.146 8.9672 11.2159C9.12987 11.2858 9.27699 11.3874 9.39999 11.5147L16 18.1147L22.6 11.5147C22.8515 11.2718 23.1883 11.1374 23.5379 11.1405C23.8875 11.1435 24.2219 11.2837 24.4691 11.531C24.7163 11.7782 24.8565 12.1126 24.8596 12.4622C24.8626 12.8118 24.7282 13.1486 24.4853 13.4001L16.9427 20.9427Z"
                  fill={"var(--text-white-aaaa)"}
                />
              </NumberTitleArrowIcon>
            </NumberGroupedHighwaysTitle>

            {isProvinceShowC && (
              <NumberGroupedHighways>{content440}</NumberGroupedHighways>
            )}
          </NumberGroupedHighways>
        </>
      )}
    </HighwayArea>
  );
}
