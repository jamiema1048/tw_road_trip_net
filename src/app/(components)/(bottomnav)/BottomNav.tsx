import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0;
  margin-bottom: 1.25rem;
`;

interface BottomNavProps {
  /**
   * 傳入當前的 pathname，例如 "/railways/lines/123"
   * 如果是 React Router 可以用 useLocation().pathname 取得
   * 如果是 Next.js 可以用 usePathname() 取得
   */
  currentPath: string;
  /** 可選：覆蓋或動態傳入特定 ID 的名稱 (例如車站名稱 "台北車站") */
  customNames?: Record<string, string>;
}

const BottomNav: React.FC<BottomNavProps> = ({
  currentPath,
  customNames = {},
}) => {
  return <Nav aria-label="bottomnav">BottomNav</Nav>;
};
export default BottomNav;
