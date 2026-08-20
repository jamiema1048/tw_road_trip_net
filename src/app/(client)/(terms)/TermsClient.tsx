"use client";
import { useState, useEffect, useContext, useRef } from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";

const TermsPageContainer = styled.div`
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
const TermsContainer = styled.div`
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

const TermsInfoSection = styled.section`
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

const TermsTitle = styled.h2`
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

const TermsDetail = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: baseline;
  gap: 0.75rem;
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const TermsHeadIcon = styled.svg`
  width: 2rem;
  height: 2rem;
  aspect-ratio: 1/1;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const TermsDetailText = styled.h3`
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

export default function TermsClient() {
  const [loading, setLoading] = useState(false);
  const { title, setTitle } = useContext(TitleContext);
  const pathname = usePathname();
  useEffect(() => {
    // 模擬載入動畫
    const timer = setTimeout(() => {
      setLoading(false);
      setTitle("使用條款");
      document.title = "使用條款";
    }, 100); // 可自行調整延遲，測試可縮短

    return () => clearTimeout(timer);
  }, [setTitle]);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TermsPageContainer>
        <TermsContainer>
          <PageTitleContainer>
            <PageTitle>
              使用條款與免責聲明（Terms of Service & Disclaimer）
            </PageTitle>
          </PageTitleContainer>
          <Breadcrumbs currentPath={pathname} />
          <Divider />
          <TermsInfoSection>
            <TermsTitle>
              一、 網站定位與非官方聲明（Nature of Service）
            </TermsTitle>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>本站定位： </strong>
                本站為獨立個人開發之非商業文史與大眾交通資料庫，旨在進行歷史考證、地理軌跡重構與學術交流。
              </TermsDetailText>
            </TermsDetail>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>非官方代表：</strong>
                本站與中華民國交通部、臺灣鐵路公司、台灣糖業公司、林務局林鐵處等公私立營運機關無任何隸屬、代理或合作關係。網站內展示之徽章、標誌、名稱，其商標權仍屬原權利人所有，本站僅於合理範圍內作為辨識與教學使用。
              </TermsDetailText>
            </TermsDetail>
          </TermsInfoSection>
          <TermsInfoSection>
            <TermsTitle>
              二、 數據免責與第三方連結條款（Limitation of Liability）
            </TermsTitle>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>不保證即時性與正確性：</strong>
                本站所提供之路線、車站、里程及幾何圖資，多屬歷史文獻整理，不保證其絕對正確性、完整性或即時性。
              </TermsDetailText>
            </TermsDetail>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>不承擔行程與人身損失：</strong>
                使用者不得將本站資料作為實際交通規劃、氣象防災、導航或登山探險之唯一依據。若因信賴本站資料而導致行程延誤、金錢損失、人身安全事故或任何衍生損害，本站不承擔任何法律與民事賠償責任。
              </TermsDetailText>
            </TermsDetail>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>第三方連結：</strong>
                本站可能包含指向官方網站（如台鐵車次查詢）或其他民間考證網頁的連結，該等外部網站之內容與隱私政策由其各自之營運者負責，本站概不負責。
              </TermsDetailText>
            </TermsDetail>
          </TermsInfoSection>
          <TermsInfoSection>
            <TermsTitle>
              三、 智慧財產權與合理使用規範（Intellectual Property）
            </TermsTitle>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>個人與非商業使用：</strong>
                使用者可以自由瀏覽本站。在非商業目的（如學術論文引用、鐵道/公路迷社群討論、個人部落格）下，歡迎引用本站整理之文字與圖表，但必須註明出處與本站網址。
              </TermsDetailText>
            </TermsDetail>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>禁止商業利用與重製： </strong>
                未經明確授權，任何人不得將本站之程式碼、自製網頁元件、整合之資料庫內容用於任何商業營利行為、廣告載體或付費服務。
              </TermsDetailText>
            </TermsDetail>
          </TermsInfoSection>
          <TermsInfoSection>
            <TermsTitle>
              四、 網站使用限制與防爬蟲條款（Acceptable Use & Anti-Scraping）
            </TermsTitle>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>禁止惡意攻擊：</strong>
                使用者不得嘗試繞過本站安全機制、注入惡意程式碼或進行阻斷服務攻擊（DoS）。
              </TermsDetailText>
            </TermsDetail>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>爬蟲與自動化限制： </strong>
                嚴禁使用任何自動化工具、網路爬蟲（Scrapers）、機器人程式（Bots）對本站資料庫進行高頻率、大批量的數據抓取。若有學術研究或非營利專案之大量數據需求，請主動聯繫本站取得
                API 或 dump 授權，避免對伺服器造成負荷。
              </TermsDetailText>
            </TermsDetail>
          </TermsInfoSection>
          <TermsInfoSection>
            <TermsTitle>
              五、 條款修改與管轄法院（Modifications & Jurisdiction）
            </TermsTitle>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>條款修改：</strong>
                本站保留隨時修改或變更本使用條款之權利，修改後之條款將直接公告於網頁，不另行個別通知。
              </TermsDetailText>
            </TermsDetail>
            <TermsDetail>
              <TermsHeadIcon
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
              </TermsHeadIcon>
              <TermsDetailText>
                <strong>準據法與管轄：</strong>
                本服務條款之解釋與適用悉依中華民國法律。若因本網站服務產生任何爭議，雙方同意以台灣高雄地方法院為第一審管轄法院。
              </TermsDetailText>
            </TermsDetail>
          </TermsInfoSection>
        </TermsContainer>
        <BottomNav />
      </TermsPageContainer>
    </>
  );
}
