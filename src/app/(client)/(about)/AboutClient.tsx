"use client";
import { useState, useEffect, useContext, useRef } from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Header from "@/src/app/(components)/(header)/header";
import Footer from "@/src/app/(components)/(footer)/footer";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";

const AboutPageContainer = styled.div`
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
const AboutContainer = styled.div`
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

const AboutInfoSection = styled.section`
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

const AboutTitle = styled.h2`
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

const AboutDetail = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: baseline;
  gap: 0.75rem;
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const AboutHeadIcon = styled.svg`
  width: 2rem;
  height: 2rem;
  aspect-ratio: 1/1;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const AboutDetailText = styled.h3`
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

export default function AboutClient() {
  const [loading, setLoading] = useState(false);
  const { title, setTitle } = useContext(TitleContext);
  const pathname = usePathname();
  useEffect(() => {
    // 模擬載入動畫
    const timer = setTimeout(() => {
      setLoading(false);
      setTitle("關於我們");
      document.title = "關於我們";
    }, 100); // 可自行調整延遲，測試可縮短

    return () => clearTimeout(timer);
  }, [setTitle]);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <AboutPageContainer>
        <AboutContainer>
          <PageTitleContainer>
            <PageTitle>
              <h1>關於我們（About Us）</h1>
            </PageTitle>
          </PageTitleContainer>
          <Breadcrumbs currentPath={pathname} />
          <Divider />
          <AboutInfoSection>
            <AboutTitle>一、 計畫初衷</AboutTitle>
            <AboutDetailText>
              <p>
                「台灣的鐵道與公路，不僅是運輸的載體，更是地景與歷史的交織面。」
              </p>
              <p>
                本站是一個由個人獨立開發、營運的非營利大眾交通與地理文史資料庫。專案建立的初衷，源於對台灣鐵路（台鐵、台糖糖業鐵道、林業鐵道、產業鐵路）與公路系統（省道、縣道、專用公路）歷史演變的沉迷。我們希望透過現代化、結構化的
                Web
                介面，將散落於公報、歷次法規修正案、舊地圖與民間考證中的路線與車站跡線重新整理，提供一個乾淨、無廣告干擾、專注於數據與歷史脈絡的數位查閱空間。
              </p>
            </AboutDetailText>
          </AboutInfoSection>
          <AboutInfoSection>
            <AboutTitle>二、 設計與開發理念</AboutTitle>
            <AboutDetail>
              <AboutHeadIcon
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
              </AboutHeadIcon>
              <AboutDetailText>
                <strong>現代極簡與數位典藏：</strong>
                視覺設計借鏡北歐公眾服務與現代技術文檔美學，以高資訊密度的網格與等寬字體排版，提供順暢的查閱體驗。
              </AboutDetailText>
            </AboutDetail>
            <AboutDetail>
              <AboutHeadIcon
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
              </AboutHeadIcon>
              <AboutDetailText>
                <strong>歷史拓撲與幾何考證：</strong>
                針對早已拆除的舊線跡、廢站，以及不同歷史時期（如民國 63 年與 78
                年）的公路徽章幾何比例，盡可能還原其當年的設計規範。
              </AboutDetailText>
            </AboutDetail>
            <AboutDetail>
              <AboutHeadIcon
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
              </AboutHeadIcon>
              <AboutDetailText>
                <strong>雙入口與數據結構：</strong>
                打破傳統鐵路與公路的界線，讓使用者能在相同的架構下，探索鐵路與公路在台灣歷史上的留下的證據。
              </AboutDetailText>
            </AboutDetail>
          </AboutInfoSection>
          <AboutInfoSection>
            <AboutTitle>三、 聯絡與社群回報（Errata & Contact）</AboutTitle>
            <AboutDetailText>
              文史考證如大海撈針，部分早期產業鐵道因年代久遠，官方文獻多有缺失或相互矛盾。若您在瀏覽時發現站名、里程、軌距、路線走勢有誤，或您手邊擁有更精準的歷史圖資與老照片願意授權公開，極度歡迎與我們聯繫：
            </AboutDetailText>
            <AboutDetail>
              <AboutHeadIcon
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
              </AboutHeadIcon>
              <AboutDetailText>
                <strong>聯絡信箱：</strong>
                stu1030113@example.com
              </AboutDetailText>
            </AboutDetail>
          </AboutInfoSection>
          <AboutInfoSection>
            <AboutTitle>四、 誌謝專區（Special Thanks）</AboutTitle>
            <AboutDetailText>
              一座數位典藏庫的建立，絕非單憑一人之力所能完成。本專案從資料考證、地理拓撲重構到網頁開發，深刻仰賴許多先行者長年累積的成果與無私分享。特此向以下機構、社群與個人致上最深切的感謝：
            </AboutDetailText>
            <AboutDetail>
              <AboutHeadIcon
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
              </AboutHeadIcon>
              <AboutDetailText>
                <strong>公部門與國立典藏機構：</strong>
                感謝中華民國交通部、公路局、台灣鐵路公司、台灣糖業公司、農業部林業及自然保育署，以及國家發展委員會檔案管理局。感謝上述單位保存並開放珍貴的交通歷史公報、地圖圖資與營運數據，使這些消失的線索得以在數位時代重現。
              </AboutDetailText>
            </AboutDetail>
            <AboutDetail>
              <AboutHeadIcon
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
              </AboutHeadIcon>
              <AboutDetailText>
                <strong>民間交通文史社群與先行者：</strong>
                感謝
                中華民國鐵道文化協會、公路邦社群，以及廣大在維基百科與個人部落格長年紀錄廢線跡、廢站與舊省道演進的考證前輩。您們踏實的田野調查與學術論文，為本站的資料結構奠定了最堅實的基石。
              </AboutDetailText>
            </AboutDetail>
            <AboutDetail>
              <AboutHeadIcon
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
              </AboutHeadIcon>
              <AboutDetailText>
                <strong>開源社群與技術提供者：</strong>
                感謝 Next.js、Tailwind CSS、MongoDB 與 CC BY-SA
                開源授權協議的維護團隊，以及提供 Highway Gothic
                等交通字型與向量圖資模組的創作者，讓本站得以實現兼具高資訊密度與現代美學的
                UI 體驗。
              </AboutDetailText>
            </AboutDetail>
            <AboutDetail>
              <AboutHeadIcon
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
              </AboutHeadIcon>
              <AboutDetailText>
                <strong>社群讀者與勘誤提供者：</strong>
                感謝所有點進本站、協助測試 UX 動線，以及透過郵件或 Issue
                主動提供歷史考證補充與勘誤說明的熱心朋友。您們的每一筆回報，都是完善台灣交通地圖不可或缺的拼圖。
              </AboutDetailText>
            </AboutDetail>
          </AboutInfoSection>
        </AboutContainer>
        <BottomNav />
      </AboutPageContainer>
    </>
  );
}
