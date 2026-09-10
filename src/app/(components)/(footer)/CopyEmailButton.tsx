"use client";

import { useCallback, useState } from "react";
import styles from "@/src/styles/components/footer/Footer.module.css";

const EMAIL = "stu1030113@gmail.com";

export default function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);
  return <div className={styles.emailWrapper}><button type="button" onClick={handleCopy} aria-label="複製 Email" className={styles.emailButton}><svg className={styles.styledEmail} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg></button>{copied && <span className={styles.tooltip}>已複製信箱！</span>}</div>;
}
