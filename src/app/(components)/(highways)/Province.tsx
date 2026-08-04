// src/app/highways/Province.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Highway } from "@/src/types/highway";

interface Props {
  highways: Highway[];
  loading: boolean;
  setLoading: (val: boolean) => void;
}

export default function Province({ highways, loading, setLoading }: Props) {
  const [isProvinceShow, setIsProvinceShow] = useState(false);
  const [isProvinceShowXX, setIsProvinceShowXX] = useState(false);
  const [isProvinceShowC, setIsProvinceShowC] = useState(false);

  // 過濾不同段的 highways
  const section420 = highways.filter(
    (hwy) => hwy.id / 100 >= 400 && hwy.id / 100 < 421,
  );
  const section440 = highways.filter(
    (hwy) => hwy.id / 100 >= 421 && hwy.id / 100 < 500,
  );

  // 分組函數
  const groupByPrefix = (section: Highway[]): Record<string, Highway[]> => {
    const grouped: Record<string, Highway[]> = {};
    section.forEach((hwy) => {
      const prefix = Math.floor(hwy.id / 100).toString();
      if (!grouped[prefix]) grouped[prefix] = [];
      grouped[prefix].push(hwy);
    });
    return grouped;
  };

  const renderGroupedHighways = (section: Highway[]) =>
    Object.entries(groupByPrefix(section)).map(([prefix, highways]) => (
      <div key={prefix} className="flex flex-wrap gap-4">
        {highways.map((hwy) => (
          <Link
            key={hwy.id}
            href={`highways/${hwy.id}`}
            className={`font-bold hover:text-yellow-400 active:text-yellow-600 highway-link ${hwy.status === "disused" ? "text-gray-500 line-through" : hwy.status === "unlisted" ? "text-blue-400 italic" : "text-white-600"}`}
          >
            {hwy.name}
          </Link>
        ))}
      </div>
    ));
  console.log("Province rendered!");

  return (
    <div
      className="ml-3 md:ml-6 lg:ml-9 mt-4"
      id="province"
      data-testid="province"
    >
      <h2
        className={`text-4xl font-semibold ${
          isProvinceShow ? "text-yellow-400" : "text-white-600"
        } cursor-pointer mb-2`}
        onClick={() => setIsProvinceShow((prev) => !prev)}
      >
        省道 {isProvinceShow ? "▲" : "▼"}
      </h2>

      {isProvinceShow && (
        <>
          <div className="space-y-4 ml-4">
            <h3
              className={`text-2xl ${
                isProvinceShowXX ? "text-yellow-400" : "text-white-600"
              } cursor-pointer font-semibold`}
              onClick={() => setIsProvinceShowXX((prev) => !prev)}
            >
              1~20 {isProvinceShowXX ? "▲" : "▼"}
            </h3>
            {isProvinceShowXX && (
              <div className="space-y-4 ml-4">
                {section420.length > 0
                  ? renderGroupedHighways(section420)
                  : "No highways found"}
              </div>
            )}
          </div>

          <div className="space-y-4 ml-4">
            <h3
              className={`text-2xl ${
                isProvinceShowC ? "text-yellow-400" : "text-white-600"
              } cursor-pointer font-semibold`}
              onClick={() => setIsProvinceShowC((prev) => !prev)}
            >
              21~ {isProvinceShowC ? "▲" : "▼"}
            </h3>
            {isProvinceShowC && (
              <div className="space-y-4 ml-4">
                {section440.length > 0
                  ? renderGroupedHighways(section440)
                  : "No highways found"}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
