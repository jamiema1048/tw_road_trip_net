import React from "react";
import styled from "styled-components";

// ==================== Styled Components ====================

const Nav = styled.nav`
  padding: 0;
`;

const List = styled.ol`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 1rem;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
`;

const Link = styled.a`
  color: #888888;
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
  font-family: Inter;
  font-size: 1.5rem;
  font-style: normal;
  line-height: normal;

  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`;

const CurrentPage = styled.span`
  color: #ffffff;
  font-weight: 500;
  font-family: Inter;
  font-size: 1.5rem;
  font-style: normal;
  line-height: normal;
`;

const Separator = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  aspect-ratio: 1/1;
`;

// 🔴 關鍵 1：路徑對照表 (Path Name Dictionary)
// 負責判斷 URL 英文片段對應到的中文名稱
const BREADCRUMB_MAP: Record<string, string> = {
  home: "首頁",
  railways: "鐵路總覽",
  highways: "公路總覽",
  lines: "路線列表",
  stations: "車站列表",
  schedule: "時刻表",
  about: "關於我們",
  // 若有動態 ID (例如 /railways/123)，可以由組件邏輯過濾或動態處理
};

interface BreadcrumbsProps {
  /**
   * 傳入當前的 pathname，例如 "/railways/lines/123"
   * 如果是 React Router 可以用 useLocation().pathname 取得
   * 如果是 Next.js 可以用 usePathname() 取得
   */
  currentPath: string;
  /** 可選：覆蓋或動態傳入特定 ID 的名稱 (例如車站名稱 "台北車站") */
  customNames?: Record<string, string>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentPath,
  customNames = {},
}) => {
  // 🔴 關鍵 2：將路徑拆解為陣列
  // 例如 "/railways/lines" -> ["railways", "lines"]
  const pathSegments = currentPath
    .split("/")
    .filter((segment) => segment !== "");

  // 組合出路徑物件陣列 [{ name: '首頁', url: '/' }, { name: '鐵道資訊', url: '/railways' }, ...]
  const breadcrumbItems = [
    { name: BREADCRUMB_MAP["home"] || "首頁", url: "/" },
    ...pathSegments.map((segment, index) => {
      // 算出當前節點的完整 URL
      const url = `/${pathSegments.slice(0, index + 1).join("/")}`;

      // 優先權：自訂名稱 > 對照表名稱 > 原始路徑文字
      const displayName =
        customNames[segment] || BREADCRUMB_MAP[segment] || segment;

      return { name: displayName, url };
    }),
  ];

  return (
    <Nav aria-label="breadcrumb">
      <List>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <Item key={item.url}>
              {isLast ? (
                // 最後一個節點（當前頁面）：不給連結，並加上 aria-current 增加無障礙支援
                <CurrentPage aria-current="page">{item.name}</CurrentPage>
              ) : (
                <>
                  <Link href={item.url}>{item.name}</Link>
                  <Separator
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9.5 6L15.5 12L9.5 18"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Separator>
                </>
              )}
            </Item>
          );
        })}
      </List>
    </Nav>
  );
};

export default Breadcrumbs;
