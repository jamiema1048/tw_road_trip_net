"use client";
import React, { useState, memo } from "react";
import Link from "next/link";
import styles from "@/src/styles/components/footer/Footer.module.css";
import { ChevronRight, Copyright, Mail } from "lucide-react";

export const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export interface ComponentFooterProps {
  device?: "desktop";
  className?: string;
}

const ContactEmail = () => {
  const [copied, setCopied] = useState(false);
  const email = "stu1030113@gmail.com";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.emailWrapper}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="複製 Email"
        className={styles.emailButton}
      >
        <Mail className={styles.styledEmail} />
      </button>

      {copied && <span className={styles.tooltip}>已複製信箱！</span>}
    </div>
  );
};

export const Footer = memo(function Footer(props: ComponentFooterProps) {
  return (
    <footer
      className={`${styles.styledComponentFooter} ${props.className || ""}`.trim()}
    >
      <div className={styles.frame}>
        <div className={styles.navigationGroup}>
          <div className={styles.navigationColumn}>
            <Link
              href="/about"
              className={styles.navigationItem}
              prefetch={false}
            >
              <ChevronRight
                className={styles.styledBreadcrumbRight}
                size={16}
              />
              <p className={styles.textWrapper}>關於我們</p>
            </Link>
            <Link
              href="/reference"
              className={styles.navigationItem}
              prefetch={false}
            >
              <ChevronRight
                className={styles.styledBreadcrumbRight}
                size={16}
              />
              <p className={styles.textWrapper}>參考資料</p>
            </Link>
          </div>
          <div className={styles.navigationColumn}>
            <Link
              href="/railways"
              className={styles.navigationItem}
              prefetch={false}
            >
              <ChevronRight
                className={styles.styledBreadcrumbRight}
                size={16}
              />
              <p className={styles.textWrapper}>車站旅途</p>
            </Link>
            <Link
              href="/highways"
              className={styles.navigationItem}
              prefetch={false}
            >
              <ChevronRight
                className={styles.styledBreadcrumbRight}
                size={16}
              />
              <p className={styles.textWrapper}>公路旅途</p>
            </Link>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.contactGroup}>
          <div className={styles.contactContent}>
            <p className={styles.textWrapper}>聯絡我們</p>
            <div className={styles.socialIcons}>
              <ContactEmail />
              <Link
                href="https://github.com/jamiema1048"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="前往 GitHub 主頁"
                className={styles.iconLink}
                prefetch={false}
              >
                <GithubIcon className={styles.styledGithub} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomFrame}>
        <div className={styles.copyrightGroup}>
          <Copyright className={styles.styledCopyright} size={16} />
          <div className={styles.copyrightText}>All Rights Reserved</div>
        </div>
        <div className={styles.bottomDivider} />
        <Link href="/terms" className={styles.termsText} prefetch={false}>
          使用條款
        </Link>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
