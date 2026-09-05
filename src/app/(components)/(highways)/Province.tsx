"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Highway } from "@/src/types/highway";
import { LazyItem } from "@/src/app/(components)/(ui)/LazyItem"; // 匯入剛剛建立的 LazyItem
import styles from "@/src/styles/components/highway/Province.module.css";

interface Props {
  section420: Highway[];
  section440: Highway[];
}

const STATUS_CLASS_MAP: Record<Highway["status"], string> = {
  active: styles.statusActive,
  disused: styles.statusDisused,
  unlisted: styles.statusUnlisted,
};

// 提取獨立選單組件，並套用 LazyItem
function GroupedHighways({ highways }: { highways: Highway[] }) {
  if (highways.length === 0) return <div>No highways found</div>;

  const sortedSection = [...highways].sort((a, b) => a.id - b.id);
  const grouped: Record<string, Highway[]> = {};

  sortedSection.forEach((hwy) => {
    const prefix = Math.floor(hwy.id / 100).toString();
    if (!grouped[prefix]) grouped[prefix] = [];
    grouped[prefix].push(hwy);
  });

  return (
    <>
      {Object.entries(grouped).map(([prefix, highwaysInGroup]) => (
        <div key={prefix} className={styles.groupedHighwaysArea}>
          {highwaysInGroup.map((hwy) => {
            const statusClass =
              STATUS_CLASS_MAP[hwy.status] || styles.statusActive;

            return (
              <LazyItem key={hwy.id}>
                <Link
                  href={`/highways/${hwy.id}`}
                  className={`${styles.groupedHighwaysLink} ${statusClass}`}
                  prefetch={false}
                >
                  <Image
                    src={
                      hwy.highwayIcon || `/highway_mark/${hwy.id}/${hwy.id}.svg`
                    }
                    alt={`${hwy.name} 圖示`}
                    width={48}
                    height={48}
                    className={styles.highwayIcon}
                  />
                  <h3 className={styles.highwayText}>{hwy.name}</h3>
                </Link>
              </LazyItem>
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Province({ section420, section440 }: Props) {
  const [isProvinceShow, setIsProvinceShow] = useState(false);
  // 使用 Set 統一管理子區塊展開狀態
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleProvince = () => {
    setIsProvinceShow((prev) => !prev);
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const sections = [
    { id: "sec420", label: "1~20", data: section420 },
    { id: "sec440", label: "21~", data: section440 },
  ];

  return (
    <div id="province" data-testid="province" className={styles.highwayArea}>
      <div className={styles.highwayAreaTitle} onClick={toggleProvince}>
        <h2 className={styles.highwayAreaTitleText}>省道</h2>
        <svg
          className={`${styles.titleArrowIcon} ${
            isProvinceShow ? styles.isOpen : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M25.414 31.414C25.039 31.7889 24.5303 31.9995 24 31.9995C23.4697 31.9995 22.9611 31.7889 22.586 31.414L11.272 20.1C11.081 19.9155 10.9286 19.6948 10.8238 19.4508C10.719 19.2068 10.6638 18.9443 10.6615 18.6788C10.6592 18.4132 10.7098 18.1498 10.8104 17.904C10.9109 17.6583 11.0594 17.4349 11.2472 17.2472C11.435 17.0594 11.6583 16.9109 11.9041 16.8103C12.1499 16.7097 12.4133 16.6591 12.6788 16.6615C12.9444 16.6638 13.2068 16.7189 13.4508 16.8238C13.6948 16.9286 13.9155 17.0809 14.1 17.272L24 27.172L33.9 17.272C34.2772 16.9076 34.7824 16.706 35.3068 16.7106C35.8312 16.7152 36.3328 16.9255 36.7037 17.2963C37.0745 17.6671 37.2848 18.1688 37.2894 18.6932C37.2939 19.2175 37.0923 19.7227 36.728 20.1L25.414 31.414Z"
            fill="var(--text-white-aaaa)"
          />
        </svg>
      </div>

      {isProvinceShow &&
        sections.map((sec) => {
          const isOpen = openSections.has(sec.id);
          return (
            <div key={sec.id} className={styles.numberGroupedHighways}>
              <div
                className={styles.numberGroupedHighwaysTitle}
                onClick={() => toggleSection(sec.id)}
              >
                <h3 className={styles.numberGroupedHighwaysTitleText}>
                  {sec.label}
                </h3>
                <svg
                  className={`${styles.numberTitleArrowIcon} ${
                    isOpen ? styles.isOpen : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.9427 20.9427C16.6926 21.1927 16.3535 21.3331 16 21.3331C15.6464 21.3331 15.3074 21.1927 15.0573 20.9427L7.51466 13.4001C7.38731 13.2771 7.28573 13.1299 7.21585 12.9673C7.14598 12.8046 7.10919 12.6296 7.10766 12.4526C7.10612 12.2755 7.13985 12.1 7.20689 11.9361C7.27394 11.7723 7.37294 11.6234 7.49813 11.4982C7.62332 11.373 7.77219 11.274 7.93605 11.207C8.09991 11.1399 8.27549 11.1062 8.45252 11.1077C8.62956 11.1093 8.80452 11.146 8.9672 11.2159C9.12987 11.2858 9.27699 11.3874 9.39999 11.5147L16 18.1147L22.6 11.5147C22.8515 11.2718 23.1883 11.1374 23.5379 11.1405C23.8875 11.1435 24.2219 11.2837 24.4691 11.531C24.7163 11.7782 24.8565 12.1126 24.8596 12.4622C24.8626 12.8118 24.7282 13.1486 24.4853 13.4001L16.9427 20.9427Z"
                    fill="var(--text-white-aaaa)"
                  />
                </svg>
              </div>
              {isOpen && (
                <div className={styles.numberGroupedHighways}>
                  <GroupedHighways highways={sec.data} />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
