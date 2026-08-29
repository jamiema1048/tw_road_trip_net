"use client";
import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import Loading from "@/src/app/(pages)/reference/loading";

const ReferencePageContainer = styled.div`
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
const ReferenceContainer = styled.div`
  background-color: var(--background);
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

const ReferenceInfoSection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 1.25rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const ReferenceTitle = styled.h2`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ReferenceDetail = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: baseline;
  gap: 0.75rem;
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const ReferenceHeadIcon = styled.svg`
  width: 2rem;
  height: 2rem;
  aspect-ratio: 1/1;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const ReferenceDetailText = styled.h3`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ReferenceDetailLinkText = styled(Link)`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const LoadingPlaceholder = styled(Loading)`
  min-height: 400px; /* 👈 預留列表高度，避免從 0 變大引發 CLS */
`;

export default function ReferenceClient() {
  const [loading, setLoading] = useState(true);
  const { title, setTitle } = useContext(TitleContext);
  const pathname = usePathname();
  useEffect(() => {
    // 模擬載入動畫
    setTitle("參考資料");
    document.title = "參考資料";
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // 可自行調整延遲，測試可縮短

    return () => clearTimeout(timer);
  }, [setTitle]);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <ReferencePageContainer>
        <ReferenceContainer>
          <PageTitleContainer>
            <PageTitle>
              參考資料與來源聲明（Data Sources & Attributions）
            </PageTitle>
          </PageTitleContainer>
          <Breadcrumbs currentPath={pathname} />
          <Divider />
          {loading ? (
            <LoadingPlaceholder />
          ) : (
            <>
              <ReferenceInfoSection>
                <ReferenceTitle>
                  一、 創用 CC 授權與合理使用聲明 (Fair Use & Creative Commons)
                </ReferenceTitle>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>合理使用（Fair Use）：</strong>
                    聲明本站所引用之歷史照片、舊版標誌、公文書檔案，皆基於教育、學術研究、文史保存等非營利目的之「合理使用」。
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>素材版權歸屬：</strong>
                    註明「頁面中轉載之老照片、測繪圖資，其著作權皆歸原創作者或原典藏機關所有，本站皆盡可能於各別頁面標註出處。若有侵權或標示不當，請聯繫本站，我們將立即修正或下架。」
                  </ReferenceDetailText>
                </ReferenceDetail>
              </ReferenceInfoSection>
              <ReferenceInfoSection>
                <ReferenceTitle>
                  二、 數據時效性與免責聲明 (Data Currency & Disclaimer)
                </ReferenceTitle>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>數據時效性聲明：</strong>
                    「本站所載之鐵道與公路數據（包含里程、營運狀態、路線走勢等），多為歷史文獻重構與學術考證紀錄，不代表當前最新之實際路況與營運現況。如需查詢即時列車車次、客運班運或公路防汛通阻，請一律以台灣鐵路公司、台灣糖業公司、公路局等官方營運單位之即時公告為準。本站不對因使用本站資料而造成的任何行程延誤或損失負責。」
                  </ReferenceDetailText>
                </ReferenceDetail>
              </ReferenceInfoSection>
              <ReferenceInfoSection>
                <ReferenceTitle>三、 官方機構與公部門開放資料</ReferenceTitle>
                <ReferenceDetailText>
                  本站之基礎地理座標、路線營運狀態、公文書記錄及歷史法規圖案，參考並引用以下公部門之公開資訊：
                </ReferenceDetailText>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>交通部 / 中華民國交通部公路局：</strong>
                    歷次《道路交通標誌標線號誌設置規則》附圖、省道與縣道里程牌設計規範。
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>
                      國家發展委員會檔案管理局（Aplus 國家檔案資訊網）：
                    </strong>
                    60-80 年代台灣公路標誌與鐵路擴建之官方圖樣檔案。
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>
                      國土測繪中心 (NLSC) / 地理資訊整合應用平台：
                    </strong>
                    基礎地理圖資與拓撲路線對照。
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>臺灣鐵路公司：</strong>
                    各鐵路路線、車站異動、營運里程與軌距原始數據。
                  </ReferenceDetailText>
                </ReferenceDetail>
              </ReferenceInfoSection>
              <ReferenceInfoSection>
                <ReferenceTitle>四、 民間資料</ReferenceTitle>
                <ReferenceDetailText>
                  本站之基礎地理座標、路線營運狀態、公文書記錄及歷史法規圖案，參考並引用以下民間同好所提供資訊：
                </ReferenceDetailText>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    楊鵬飛《台灣區鐵道古今站名詞典》
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    戴震宇《台灣的鐵道》
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    戴震宇《台灣的老火車站》
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    蘇昭旭《阿里山林業鐵路與台灣林業鐵路傳奇》
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    臉書社團 - 踏查產業鐵道文化路徑
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    臉書社團 - 鐵道文化之旅
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailLinkText href="https://blog.xuite.net/ticket0610/">
                    看橋工房
                  </ReferenceDetailLinkText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailLinkText href="http://trstour.com/index1.htm">
                    驛站之旅
                  </ReferenceDetailLinkText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailLinkText href="https://blog.xuite.net/lan730826/blog1">
                    https://blog.xuite.net/lan730826/blog1
                  </ReferenceDetailLinkText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailLinkText href="https://blog.xuite.net/sandiaoling/blog">
                    https://blog.xuite.net/sandiaoling/blog
                  </ReferenceDetailLinkText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailLinkText href="https://twroad.org/">
                    公路邦
                  </ReferenceDetailLinkText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailLinkText href="https://www.google.com/maps/d/u/0/viewer?mid=1vVF4DVLLea0wTYEFPTM603GRAg8&ll=23.14278596517922%2C120.55716562857603&z=10">
                    台湾 臺糖鐵道 廃線跡 配線図式路線図
                  </ReferenceDetailLinkText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailLinkText href="https://www.google.com/maps/d/u/0/viewer?fbclid=IwAR01dRY9aRsKFx22_KfdLRxcrhKvkTIYj3BrKjVVPouW6xH56qe0lZPQVq4&mid=19il7JkRjkRTPqHIdY6GMa-irHpx4AP8&ll=18.54279710319958%2C116.75398669999998&z=5">
                    台車軌道地圖集
                  </ReferenceDetailLinkText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailLinkText href="https://tenriversnote.com/sugar17/">
                    南州糖廠開火車
                  </ReferenceDetailLinkText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailLinkText href="https://hsilo.yunlin.gov.tw/%e8%a5%bf%e8%9e%ba%e9%8e%ae%e8%aa%8c/%e7%ac%ac01%e7%af%87%e6%ad%b7%e5%8f%b2%e6%b2%bf%e9%9d%a9%e8%88%87%e6%8b%93%e6%ae%96/1-1%e8%a5%bf%e8%9e%ba%e9%8e%ae%e5%a4%a7%e4%ba%8b%e8%a8%98.pdf">
                    西螺鎮誌
                  </ReferenceDetailLinkText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailLinkText href="http://www.taisuco.com/monthly/CPN.aspx?ms=1455&p=13387804&s=13387829">
                    http://www.taisuco.com/monthly/CPN.aspx?ms=1455&p=13387804&s=13387829
                  </ReferenceDetailLinkText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>維基百科（Wikipedia）開放內容宣告：</strong>
                    <p>
                      本站部分車站歷史沿革、開通年份、路線長度數據及歷史徽章圖資，參考並整理自中文維基百科與維基共享資源之相關交通條目。
                    </p>
                    <p>
                      相關內容依據 創用 CC 姓名標示-相同方式分享 4.0 國際
                      授權條款 (CC BY-SA 4.0)
                      發布。本站對原始數據進行了資料結構化與視覺排版重構，特此誌謝所有維基百科貢獻者對台灣交通文史之整理。
                    </p>
                  </ReferenceDetailText>
                </ReferenceDetail>
              </ReferenceInfoSection>
              <ReferenceInfoSection>
                <ReferenceTitle>
                  五、 民間考證、學術研究與社群誌謝
                </ReferenceTitle>
                <ReferenceDetailText>
                  本站許多細微的廢線跡定位與舊公路徽章演進，深刻仰賴台灣民間強大且前瞻的公路與鐵道研究成果，特此向以下社群與研究者表達最高敬意：
                </ReferenceDetailText>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>維基共享資源 (Wikimedia Commons)：</strong>
                    台灣公路標誌（Taiwanese Highway Shields）開源向量圖資考證。
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>中華民國鐵道文化協會 / 公路邦社群：</strong>
                    歷年對台灣鐵道廢線、糖鐵路線及舊省道線跡之田野調查與論文發表。
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>各地理與文史部落客：</strong>
                    長年紀錄廢站、廢線與交通遺蹟之先行者。
                  </ReferenceDetailText>
                </ReferenceDetail>
              </ReferenceInfoSection>
              <ReferenceInfoSection>
                <ReferenceTitle>六、 網站技術與開源組件</ReferenceTitle>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>前端框架：</strong>
                    Next.js, Tailwind CSS, Styled Component
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>資料庫：</strong>
                    MongoDB
                  </ReferenceDetailText>
                </ReferenceDetail>
                <ReferenceDetail>
                  <ReferenceHeadIcon
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
                      fill={"var(--text-white-aaaa)"}
                    />
                  </ReferenceHeadIcon>
                  <ReferenceDetailText>
                    <strong>字體與圖示：</strong>
                    Roboto Mono, Overpass (Highway Gothic 衍生字型),
                    自製幾何交通 SVG
                  </ReferenceDetailText>
                </ReferenceDetail>
              </ReferenceInfoSection>
            </>
          )}
        </ReferenceContainer>
        <BottomNav />
      </ReferencePageContainer>
    </>
  );
}
