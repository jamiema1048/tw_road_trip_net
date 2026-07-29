"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

// 定義 Context 的型別
interface TitleContextType {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

// 提供預設值，TS 需要初始型別對應
export const TitleContext = createContext<TitleContextType>({
  title: "首頁",
  setTitle: () => {},
});

// 定義 props 型別
interface TitleProviderProps {
  children: ReactNode;
}

export const TitleProvider: React.FC<TitleProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const [title, setTitle] = useState<string>(() => {
    switch (pathname) {
      case "/railways":
        return "路線總覽";
      default:
        return "首頁";
    }
  });

  useEffect(() => {
    let newTitle = "首頁";
    switch (pathname) {
      case "/railways":
        newTitle = "路線總覽";
        break;
    }
    setTitle(newTitle);
    document.title = newTitle;
  }, [pathname]);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
