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

function getTitleFromPathname(pathname: string): string {
  switch (pathname) {
    case "/railways":
      return "路線總覽";
    case "/highways":
      return "公路列表";
    case "/reference":
      return "參考資料";
    case "/about":
      return "關於我們";
    case "/terms":
      return "使用條款";
    default:
      return "首頁";
  }
}

export const TitleProvider: React.FC<TitleProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [title, setTitle] = useState<string>(() =>
    getTitleFromPathname(pathname),
  );

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setTitle(getTitleFromPathname(pathname));
  }

  // 🟢 2. Effect 只負責同步外面的 DOM (document.title)
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
