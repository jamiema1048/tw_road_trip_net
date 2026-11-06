import Link from "next/link";
import Breadcrumbs from "@/src/components/layout/Breadcrumbs/Breadcrumbs";
import type { Announcement } from "../announcement.types";
import { formatAnnouncementDate } from "../announcement.data";
import AnnouncementLayout, { DemoNotice } from "./AnnouncementLayout";
import styles from "./Announcement.module.css";

export default function AnnouncementListPage({ announcements }: { announcements: Announcement[] }) {
  return (
    <AnnouncementLayout>
      <div className={styles.listContainer}>
        <header className={styles.listHeader}>
          <h1 className={styles.pageTitle}>公告</h1>
          <div className={styles.breadcrumbs}>
            <Breadcrumbs currentPath="/announcement" customNames={{ announcement: "公告" }} />
          </div>
          <div className={styles.divider} />
          <div className={styles.listDescription}>
            <DemoNotice />
            <p className={styles.count}>共 {announcements.length} 則</p>
          </div>
        </header>
        <ul className={styles.list} aria-label="公告清單">
          {announcements.map((announcement) => (
            <li className={styles.listItem} key={announcement.id}>
              <div className={styles.listMeta}>
                <time dateTime={announcement.date}>{formatAnnouncementDate(announcement.date)}</time>
                <span className={styles.category}>{announcement.category}</span>
              </div>
              <div className={styles.listContent}>
                <h2 className={styles.listTitle}>
                  <Link href={`/announcement/${announcement.id}`}>{announcement.title}</Link>
                </h2>
                <p className={styles.summary}>{announcement.summary}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AnnouncementLayout>
  );
}
