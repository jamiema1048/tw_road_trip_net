import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0;
  margin-bottom: 1.25rem;
  gap: 3rem;
`;

const BottomNavLink = styled.a`
  display: block;
  color: #fff;
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
    color: #2f7716; /* hover:text-green-400 */
  }
`;

interface BottomNavProps {
  /**
   * 傳入當前的 pathname，例如 "/railways/lines/123"
   * 如果是 React Router 可以用 useLocation().pathname 取得
   * 如果是 Next.js 可以用 usePathname() 取得
   */
  // currentPath: string;
  // /** 可選：覆蓋或動態傳入特定 ID 的名稱 (例如車站名稱 "台北車站") */
  // customNames?: Record<string, string>;
}

const BottomNav: React.FC<BottomNavProps> = (
  {
    // currentPath,
    // customNames = {},
  },
) => {
  return (
    <Nav aria-label="bottomnav">
      <BottomNavLink>回到最上方</BottomNavLink>
      <BottomNavLink>回首頁</BottomNavLink>
    </Nav>
  );
};
export default BottomNav;
