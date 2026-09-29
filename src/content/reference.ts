export interface ReferenceItem {
  subtitle: string;
  content?: string;
  link?: string;
}

export interface ReferenceSection {
  title: string;
  subtitle?: string;
  items: ReferenceItem[];
}

export const Reference_DATA: ReferenceSection[] = [
  {
    title: "一、 創用 CC 授權與合理使用聲明 (Fair Use & Creative Commons)",
    items: [
      {
        subtitle: "合理使用（Fair Use）：",
        content:
          "本站為獨立個人開發之非商業文史與大眾交通資料庫，旨在進行歷史考證、地理軌跡重構與學術交流。",
      },
      {
        subtitle: "素材版權歸屬：",
        content:
          "註明「頁面中轉載之老照片、測繪圖資，其著作權皆歸原創作者或原典藏機關所有，本站皆盡可能於各別頁面標註出處。若有侵權或標示不當，請聯繫本站，我們將立即修正或下架。」",
      },
    ],
  },
  {
    title: "二、 數據時效性與免責聲明 (Data Currency & Disclaimer)",
    items: [
      {
        subtitle: "數據時效性聲明：",
        content:
          "「本站所載之鐵道與公路數據（包含里程、營運狀態、路線走勢等），多為歷史文獻重構與學術考證紀錄，不代表當前最新之實際路況與營運現況。如需查詢即時列車車次、客運班運或公路防汛通阻，請一律以台灣鐵路公司、台灣糖業公司、公路局等官方營運單位之即時公告為準。本站不對因使用本站資料而造成的任何行程延誤或損失負責。」",
      },
    ],
  },
  {
    title: "三、 官方機構與公部門開放資料",
    subtitle:
      "本站之基礎地理座標、路線營運狀態、公文書記錄及歷史法規圖案，參考並引用以下公部門之公開資訊：",
    items: [
      {
        subtitle: "交通部 / 中華民國交通部公路局：",
        content:
          "歷次《道路交通標誌標線號誌設置規則》附圖、省道與縣道里程牌設計規範。",
      },
      {
        subtitle: "國家發展委員會檔案管理局（Aplus 國家檔案資訊網）：",
        content: "60-80 年代台灣公路標誌與鐵路擴建之官方圖樣檔案。",
      },
      {
        subtitle: "國土測繪中心 (NLSC) / 地理資訊整合應用平台：",
        content: "基礎地理圖資與拓撲路線對照。",
      },
      {
        subtitle: "臺灣鐵路公司：",
        content: "各鐵路路線、車站異動、營運里程與軌距原始數據。",
      },
    ],
  },
  {
    title: "四、 民間資料",
    subtitle:
      "本站之基礎地理座標、路線營運狀態、公文書記錄及歷史法規圖案，參考並引用以下民間同好所提供資訊：",
    items: [
      {
        subtitle: "楊鵬飛《台灣區鐵道古今站名詞典》",
      },
      {
        subtitle: "戴震宇《台灣的鐵道》",
      },
      {
        subtitle: "戴震宇《台灣的老火車站》",
      },
      {
        subtitle: "蘇昭旭《阿里山林業鐵路與台灣林業鐵路傳奇》",
      },
      {
        subtitle: "臉書社團 - 踏查產業鐵道文化路徑",
      },
      {
        subtitle: "臉書社團 - 鐵道文化之旅",
      },
      {
        subtitle: "看橋工房",
        link: "https://blog.xuite.net/ticket0610/",
      },
      {
        subtitle: "驛站之旅",
        link: "http://trstour.com/index1.htm",
      },
      {
        subtitle: "https://blog.xuite.net/lan730826/blog1",
        link: "https://blog.xuite.net/lan730826/blog1",
      },
      {
        subtitle: "https://blog.xuite.net/sandiaoling/blog",
        link: "https://blog.xuite.net/sandiaoling/blog",
      },
      {
        subtitle: "公路邦",
        link: "https://twroad.org/",
      },
      {
        subtitle: "台湾 臺糖鐵道 廃線跡 配線図式路線図",
        link: "https://www.google.com/maps/d/u/0/viewer?mid=1vVF4DVLLea0wTYEFPTM603GRAg8&ll=23.14278596517922%2C120.55716562857603&z=10",
      },
      {
        subtitle: "台車軌道地圖集",
        link: "https://www.google.com/maps/d/u/0/viewer?fbclid=IwAR01dRY9aRsKFx22_KfdLRxcrhKvkTIYj3BrKjVVPouW6xH56qe0lZPQVq4&mid=19il7JkRjkRTPqHIdY6GMa-irHpx4AP8&ll=18.54279710319958%2C116.75398669999998&z=5",
      },
      {
        subtitle: "南州糖廠開火車",
        link: "https://tenriversnote.com/sugar17/",
      },
      {
        subtitle: "西螺鎮誌",
        link: "https://hsilo.yunlin.gov.tw/%e8%a5%bf%e8%9e%ba%e9%8e%ae%e8%aa%8c/%e7%ac%ac01%e7%af%87%e6%ad%b7%e5%8f%b2%e6%b2%bf%e9%9d%a9%e8%88%87%e6%8b%93%e6%ae%96/1-1%e8%a5%bf%e8%9e%ba%e9%8e%ae%e5%a4%a7%e4%ba%8b%e8%a8%98.pdf",
      },
      {
        subtitle:
          "http://www.taisuco.com/monthly/CPN.aspx?ms=1455&p=13387804&s=13387829",
        link: "http://www.taisuco.com/monthly/CPN.aspx?ms=1455&p=13387804&s=13387829",
      },
      {
        subtitle: "維基百科（Wikipedia）開放內容宣告：",
        content:
          "本站部分車站歷史沿革、開通年份、路線長度數據及歷史徽章圖資，參考並整理自中文維基百科與維基共享資源之相關交通條目。相關內容依據 創用 CC 姓名標示-相同方式分享 4.0 國際 授權條款 (CC BY-SA 4.0) 發布。本站對原始數據進行了資料結構化與視覺排版重構，特此誌謝所有維基百科貢獻者對台灣交通文史之整理。",
      },
    ],
  },
  {
    title: "五、 民間考證、學術研究與社群誌謝",
    subtitle:
      "本站許多細微的廢線跡定位與舊公路徽章演進，深刻仰賴台灣民間強大且前瞻的公路與鐵道研究成果，特此向以下社群與研究者表達最高敬意：",
    items: [
      {
        subtitle: "維基共享資源 (Wikimedia Commons)：",
        content: "台灣公路標誌（Taiwanese Highway Shields）開源向量圖資考證。",
      },
      {
        subtitle: "中華民國鐵道文化協會 / 公路邦社群：",
        content:
          "歷年對台灣鐵道廢線、糖鐵路線及舊省道線跡之田野調查與論文發表。",
      },
      {
        subtitle: "各地理與文史部落客：",
        content: "長年紀錄廢站、廢線與交通遺蹟之先行者。",
      },
    ],
  },
  {
    title: "六、 網站技術與開源組件",
    items: [
      {
        subtitle: "前端框架：",
        content: "Next.js, Tailwind CSS, Styled Component",
      },
      {
        subtitle: "資料庫：",
        content: "MongoDB",
      },
      {
        subtitle: "字體與圖示：",
        content:
          "Roboto Mono, Overpass (Highway Gothic 衍生字型), 自製幾何交通 SVG",
      },
    ],
  },
];
