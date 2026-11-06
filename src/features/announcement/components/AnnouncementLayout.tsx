import type { ReactNode } from "react";
import Link from "next/link";
import ScrollToTopButton from "@/src/components/layout/BottomNav/ScrollToTopButton";
import styles from "./Announcement.module.css";

export default function AnnouncementLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      {children}
      <nav className={styles.bottomNav} aria-label="頁面導覽">
        <ScrollToTopButton className={styles.bottomLink} />
        <Link className={styles.bottomLink} href="/">回首頁</Link>
        <Link className={styles.bottomLink} href="/railways">回車站旅途</Link>
        <Link className={styles.bottomLink} href="/highways">回公路旅途</Link>
      </nav>
    </div>
  );
}

export function DemoNotice({ detail = false }: { detail?: boolean }) {
  return (
    <div className={styles.demoNotice}>
      <span className={styles.demoBadge}>示範公告</span>
      <p>{detail ? "本篇為網站使用與內容更新範例，非官方營運公告。" : "以下為網站使用與內容更新範例，非官方營運公告。"}</p>
    </div>
  );
}
