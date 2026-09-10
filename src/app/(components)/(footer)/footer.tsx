import Link from "next/link";
import CopyEmailButton from "@/src/app/(components)/(footer)/CopyEmailButton";
import styles from "@/src/styles/components/footer/Footer.module.css";

export interface ComponentFooterProps { className?: string; }

function ChevronRightIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>;
}
function CopyrightIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M14.83 14.83a4 4 0 1 1 0-5.66" /></svg>;
}
function GithubIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>;
}

export function Footer({ className = "" }: ComponentFooterProps) {
  return <footer className={`${styles.styledComponentFooter} ${className}`.trim()}>
    <div className={styles.frame}>
      <div className={styles.navigationGroup}>
        <div className={styles.navigationColumn}>
          <Link href="/about" className={styles.navigationItem}><ChevronRightIcon className={styles.styledBreadcrumbRight} /><p className={styles.textWrapper}>關於我們</p></Link>
          <Link href="/reference" className={styles.navigationItem}><ChevronRightIcon className={styles.styledBreadcrumbRight} /><p className={styles.textWrapper}>參考資料</p></Link>
        </div>
        <div className={styles.navigationColumn}>
          <Link href="/railways" className={styles.navigationItem}><ChevronRightIcon className={styles.styledBreadcrumbRight} /><p className={styles.textWrapper}>車站旅途</p></Link>
          <Link href="/highways" className={styles.navigationItem}><ChevronRightIcon className={styles.styledBreadcrumbRight} /><p className={styles.textWrapper}>公路旅途</p></Link>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.contactGroup}><div className={styles.contactContent}><p className={styles.textWrapper}>聯絡我們</p><div className={styles.socialIcons}><CopyEmailButton /><Link href="https://github.com/jamiema1048" target="_blank" rel="noopener noreferrer" aria-label="前往 GitHub 主頁" className={styles.iconLink}><GithubIcon className={styles.styledGithub} /></Link></div></div></div>
    </div>
    <div className={styles.bottomFrame}><div className={styles.copyrightGroup}><CopyrightIcon className={styles.styledCopyright} /><div className={styles.copyrightText}>All Rights Reserved</div></div><div className={styles.bottomDivider} /><Link href="/terms" className={styles.termsText}>使用條款</Link></div>
  </footer>;
}
