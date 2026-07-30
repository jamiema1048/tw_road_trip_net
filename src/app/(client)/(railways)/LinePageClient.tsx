"use client";
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RailwayCompanyGroup } from "@/src/app/(components)/(railways)/RailwayCompanyGroup";
import Header from "@/src/app/(components)/(header)/header";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import Footer from "@/src/app/(components)/(footer)/footer";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";

// import { BreadcrumbRight } from "./BreadcrumbRight";
// import { ComponentFooterSubsection } from "./ComponentFooterSubsection";
// import { ComponentHeaderSubsection } from "./ComponentHeaderSubsection";
// import { DropListDown } from "./DropListDown";
// import { DropListUp } from "./DropListUp";
// import { FrameSubsection } from "./FrameSubsection";
// import { FrameWrapperSubsection } from "./FrameWrapperSubsection";

interface Line {
  id: number;
  name: string;
  co: number;
  district: {
    districtID: number;
    districtName: string;
    prevArea?: number;
    nextArea?: number;
  }[];
}

interface Props {
  lines: Line[];
}

const RailwayListPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000000;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;
const RailwayListContainer = styled.div`
  background-color: #000000;
  width: 100%;
  padding: 1.75rem 3rem 1.75rem 3rem;
  @media (max-width: 576px) {
    padding: 1.25rem 4.5rem 1.25rem 4.5rem;
  }
`;

const PageTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.25rem auto;
`;
const PageTitle = styled.div`
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: 3rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
`;

const Divider = styled.div`
  background-color: #ffffff;
  height: 1px;
  margin: 1.25rem auto;
  width: 100%;
`;

export default function LinePageClient({ lines }: Props) {
  const { title, setTitle } = useContext(TitleContext);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // 模擬載入動畫
    const timer = setTimeout(() => {
      setLoading(false);
      setTitle("鐵路總覽");
      document.title = "鐵路總覽";
    }, 100); // 可自行調整延遲，測試可縮短

    return () => clearTimeout(timer);
  }, [setTitle]); //Context完成後補回setTitle

  // 根據 co 分組
  const groupedByCo = lines.reduce<Record<number, Line[]>>((acc, line) => {
    if (!acc[line.co]) acc[line.co] = [];
    acc[line.co].push(line);
    return acc;
  }, {});

  const companyMap: Record<number, string> = {
    1: "台鐵",
    2: "林業鐵路",
    3: "糖業鐵路",
    4: "其他鐵路",
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <RailwayListPageContainer>
        <Header />
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-200">
            <p className="text-xl text-white mt-4">Loading data...</p>
          </div>
        ) : (
          <RailwayListContainer>
            <PageTitleContainer>
              <PageTitle>
                <h1>🚉 鐵路總覽</h1>
              </PageTitle>
            </PageTitleContainer>
            <Breadcrumbs currentPath={pathname} />
            <Divider />
            {Object.entries(groupedByCo).map(([co, lineList]) => (
              <RailwayCompanyGroup
                key={co}
                co={co}
                companyMap={companyMap}
                lineList={lineList} // 這裡直接傳入該 co 專屬的路線陣列
              />
            ))}
          </RailwayListContainer>
        )}
        <BottomNav />
        <Footer />
      </RailwayListPageContainer>
    </>
  );
}

// const ForestryRailwayGroup = styled.div`
//   display: flex;
//   gap: 16px;
//   height: 48px;
//   left: 48px;
//   position: absolute;
//   top: 631px;
//   width: 226px;
// `;

// const SugarRailwayGroup = styled.div`
//   display: flex;
//   gap: 16px;
//   height: 48px;
//   left: 48px;
//   position: absolute;
//   top: 707px;
//   width: 226px;
// `;

// const BreadcrumbGroup = styled.div`
//   display: flex;
//   height: 29px;
//   left: 56px;
//   position: absolute;
//   top: 181px;
//   width: 172px;
// `;

// const BreadcrumbHome = styled.div`
//   color: #ffffff;
//   font-family: "Inter-Regular", Helvetica;
//   font-size: 24px;
//   font-weight: 400;
//   height: 29px;
//   letter-spacing: 0;
//   line-height: normal;
//   text-decoration: underline;
//   width: 48px;
// `;

// const StyledBreadcrumbRight = styled(BreadcrumbRight)`
//   aspect-ratio: 1 !important;
//   height: 24px !important;
//   margin-top: 3px !important;
//   width: 24px !important;
// `;

// const BreadcrumbCurrent = styled.div`
//   color: #ffffff;
//   font-family: "Inter-Regular", Helvetica;
//   font-size: 24px;
//   font-weight: 400;
//   height: 29px;
//   letter-spacing: 0;
//   line-height: normal;
//   width: 96px;
// `;

// const HiddenBackToTopText = styled.div`
//   color: #000000;
//   font-family: "Inter-Regular", Helvetica;
//   font-size: 20px;
//   font-weight: 400;
//   left: 570px;
//   letter-spacing: 0;
//   line-height: normal;
//   position: absolute;
//   top: 963px;
//   white-space: nowrap;
// `;

// const HiddenHomeText = styled.div`
//   color: #000000;
//   font-family: "Inter-Regular", Helvetica;
//   font-size: 20px;
//   font-weight: 400;
//   left: 760px;
//   letter-spacing: 0;
//   line-height: normal;
//   position: absolute;
//   top: 958px;
//   white-space: nowrap;
// `;

// const FooterLinks = styled.div`
//   display: flex;
//   gap: 48px;
//   height: 24px;
//   left: 616px;
//   position: absolute;
//   top: 871px;
//   width: 212px;
// `;

// const BackToTopText = styled.div`
//   color: #ffffff;
//   font-family: "Inter-Regular", Helvetica;
//   font-size: 20px;
//   font-weight: 400;
//   height: 24px;
//   letter-spacing: 0;
//   line-height: normal;
//   white-space: nowrap;
//   width: 100px;
// `;

// const HomeText = styled.div`
//   color: #ffffff;
//   font-family: "Inter-Regular", Helvetica;
//   font-size: 20px;
//   font-weight: 400;
//   height: 24px;
//   letter-spacing: 0;
//   line-height: normal;
//   white-space: nowrap;
//   width: 60px;
// `;

// export const RailwayManagement = (): JSX.Element => {
//   return (
//     <RailwayManagementContainer>
//       <PageTitle>路線一覽</PageTitle>
//       <RailwayGroup>
//         <RailwayText>台鐵</RailwayText>
//         <StyledDropListUp color="white" />
//       </RailwayGroup>
//       <ForestryRailwayGroup>
//         <RailwayText>林業鐵道</RailwayText>
//         <StyledDropListDown color="white" />
//       </ForestryRailwayGroup>
//       <SugarRailwayGroup>
//         <RailwayText>糖業鐵道</RailwayText>
//         <StyledDropListUp color="white" />
//       </SugarRailwayGroup>
//       <BreadcrumbGroup>
//         <BreadcrumbHome>首頁</BreadcrumbHome>
//         <StyledBreadcrumbRight color="white" />
//         <BreadcrumbCurrent>車站旅途</BreadcrumbCurrent>
//       </BreadcrumbGroup>
//       <HiddenBackToTopText>回到最上方</HiddenBackToTopText>
//       <HiddenHomeText>回首頁</HiddenHomeText>
//       <FrameSubsection />
//       <FrameWrapperSubsection />
//       <FooterLinks>
//         <BackToTopText>回到最上方</BackToTopText>
//         <HomeText>回首頁</HomeText>
//       </FooterLinks>
//       <ComponentFooterSubsection />
//       <Divider />
//       <ComponentHeaderSubsection />
//     </RailwayManagementContainer>
//   );
// };
