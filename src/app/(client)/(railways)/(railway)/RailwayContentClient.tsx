"use client";
import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import DistrictGroupedStations from "@/src/app/(components)/(railways)/(railway)/DistrictGroupedStations";
import Head from "next/head";
import { usePathname } from "next/navigation";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import Loading from "@/src/app/(pages)/railways/[railwayId]/loading";
import NotFound from "@/src/app/(pages)/railways/[railwayId]/not-found";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import { Station, StationLineDistrict, RailwayData } from "@/src/types/railway";

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
}

const StationListPageContainer = styled.div`
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
const RailwayListContainerArea = styled.div`
  background-color: #000000;
  align-items: center;
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

export default function RailwayContentClient({ data, stations }: Props) {
  const { title, setTitle } = useContext(TitleContext);
  const [loading, setLoading] = useState(true);
  const [notFoundPage, setNotFoundPage] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!data) {
        setNotFoundPage(true);
        setTitle("無法顯示");
        document.title = "無法顯示";
        return;
      }
      setLoading(false);
      setTitle(`Railway ${data.name}`);
      document.title = `${data.name}`;
    }, 100); // 延遲模擬

    return () => clearTimeout(timer);
  }, [data, setTitle]); //修好後補回第二個param : setTitle

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <StationListPageContainer>
        {loading ? (
          <Loading />
        ) : notFoundPage ? (
          <NotFound />
        ) : (
          <RailwayListContainerArea>
            <PageTitleContainer>
              <PageTitle>
                <h1>{data.name}</h1>
              </PageTitle>
            </PageTitleContainer>
            <Breadcrumbs currentPath={pathname} />
            <Divider />
            <DistrictGroupedStations
              lineID={data.id}
              lineData={data}
              stations={stations}
              loading={loading}
              setLoading={setLoading}
            />
          </RailwayListContainerArea>
        )}
        <BottomNav />
      </StationListPageContainer>
    </>
  );
}
