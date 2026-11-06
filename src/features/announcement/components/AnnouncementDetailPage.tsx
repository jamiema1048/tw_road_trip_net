import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/src/components/layout/Breadcrumbs/Breadcrumbs";
import type { Announcement } from "../announcement.types";
import { formatAnnouncementDate } from "../announcement.data";
import AnnouncementLayout, { DemoNotice } from "./AnnouncementLayout";
import styles from "./Announcement.module.css";

interface Props {
  announcement: Announcement;
  previous?: Announcement;
  next?: Announcement;
}

function Arrow({ right = false }: { right?: boolean }) {
  return <Image className={styles.arrow} src={`/announcement/arrow-${right ? "right" : "left"}.svg`} width={24} height={24} alt="" aria-hidden="true" />;
}

function AdjacentAnnouncement({ announcement, next = false }: { announcement: Announcement; next?: boolean }) {
  return (
    <Link href={`/announcement/${announcement.id}`} className={`${styles.adjacentLink} ${next ? styles.next : ""}`}>
      <span className={styles.pageButton}>
        {!next && <Arrow />}
        {next ? "下一頁" : "上一頁"}
        {next && <Arrow right />}
      </span>
      <span className={styles.adjacentTitle}>{announcement.title}</span>
      <time className={styles.adjacentDate} dateTime={announcement.date}>{formatAnnouncementDate(announcement.date)}</time>
    </Link>
  );
}

export default function AnnouncementDetailPage({ announcement, previous, next }: Props) {
  return (
    <AnnouncementLayout>
      <article className={styles.detailContainer}>
        <header className={styles.detailHeader}>
          <h1 className={styles.pageTitle}>{announcement.title}</h1>
          <div className={styles.breadcrumbs}>
            <Breadcrumbs currentPath={`/announcement/${announcement.id}`} customNames={{ announcement: "公告", [announcement.id]: "公告詳細內容" }} />
          </div>
          <div className={styles.detailMeta}>
            <time dateTime={announcement.date}>{formatAnnouncementDate(announcement.date)}</time>
            <span className={styles.category}>{announcement.category}</span>
          </div>
        </header>
        <div className={styles.divider} />
        <div className={styles.body}>
          <p className={styles.lead}>{announcement.summary}</p>
          {announcement.sections.map((section) => (
            <section className={styles.section} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}
            </section>
          ))}
        </div>
        <DemoNotice detail />
        <nav className={styles.articleNav} aria-label="公告導覽">
          <Link className={styles.backButton} href="/announcement"><Arrow />返回公告</Link>
          <div className={styles.adjacentNav}>
            {previous && <AdjacentAnnouncement announcement={previous} />}
            {next && <AdjacentAnnouncement announcement={next} next />}
          </div>
        </nav>
      </article>
    </AnnouncementLayout>
  );
}
