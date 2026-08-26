"use client";
import { useContext, useEffect } from "react";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import DistrictGroupedStations from "@/src/app/(components)/(railways)/(railway)/DistrictGroupedStations";
import Head from "next/head";
import { usePathname, notFound } from "next/navigation";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import { Station, RailwayData } from "@/src/types/railway";

// interface District {
//   districtID: number;
//   districtName: string;
//   prevArea?: number;
//   nextArea?: number;
// }

// interface StationLineInfo {
//   lineID: number;
//   lineDistrict: number;
// }

// interface Station {
//   id: number;
//   name: string;
//   status: "active" | "disused" | "plan";
//   line: StationLineInfo[];
//   prevStation?: number[] | number;
//   nextStation?: number[] | number;
// }

// interface RailwayData {
//   id: number;
//   name: string;
//   district: District[];
// }

interface Props {
  data: RailwayData;
  stations: Station[];
  railwayNameMap: Record<number, string>;
}

const StationListPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--background);
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
const RailwayListContainerArea = styled.div`
  background-color: var(--background);
  align-items: center;
  width: 100%;
  padding: 1.75rem 3rem 1.75rem 3rem;
  @media (max-width: 768px) {
    padding: 1.25rem 2.5rem 1.25rem 2.5rem;
  }
`;

const PageTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.25rem auto;
`;
const PageTitle = styled.div`
  color: var(--text-white-aaaa);
  font-family: "Inter-Regular", Helvetica;
  font-size: 3rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Divider = styled.div`
  background-color: var(--text-white-aaaa);
  height: 1px;
  margin: 1.25rem auto;
  width: 100%;
  @media (max-width: 768px) {
    margin: 0.75rem auto;
  }
`;

export default function RailwayContentClient({
  data,
  stations,
  railwayNameMap,
}: Props) {
  const { title, setTitle } = useContext(TitleContext);
  const pathname = usePathname();

  if (!data) {
    notFound();
  }

  useEffect(() => {
    const pageTitle = data ? data.name : "無法顯示";
    setTitle(pageTitle);
    document.title = pageTitle;
  }, [data, setTitle]); //修好後補回第二個param : setTitle

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <StationListPageContainer>
        <RailwayListContainerArea>
          <PageTitleContainer>
            <PageTitle>{data.name}</PageTitle>
          </PageTitleContainer>
          <Breadcrumbs
            currentPath={pathname}
            customNames={{
              [data.id]: data.name,
            }}
          />
          <Divider />
          <DistrictGroupedStations
            lineID={data.id}
            lineData={data}
            stations={stations}
            railwayNameMap={railwayNameMap}
          />
        </RailwayListContainerArea>
        <BottomNav />
      </StationListPageContainer>
    </>
  );
}
