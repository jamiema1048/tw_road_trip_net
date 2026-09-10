"use client";

import { useEffect, useRef } from "react";
import styles from "@/src/styles/components/header/Header.module.css";

export default function MobileMenuToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const header = buttonRef.current?.closest("header");
    if (!header) return;
    const closeMenu = (event: MouseEvent) => {
      if (!(event.target as Element).closest("[data-mobile-menu-link]")) return;
      header.dataset.menuOpen = "false";
      buttonRef.current?.setAttribute("aria-expanded", "false");
    };
    header.addEventListener("click", closeMenu);
    return () => header.removeEventListener("click", closeMenu);
  }, []);
  const toggleMenu = () => {
    const header = buttonRef.current?.closest("header");
    if (!header) return;
    const isOpen = header.dataset.menuOpen === "true";
    header.dataset.menuOpen = String(!isOpen);
    buttonRef.current?.setAttribute("aria-expanded", String(!isOpen));
  };
  return <button ref={buttonRef} type="button" className={`${styles.moreOptionButton} more-option`} aria-label="開啟選單" aria-expanded="false" onClick={toggleMenu}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={styles.svgStrokeIcon}><path className={styles.menuOpenIcon} d="M4.125 18.375H19.875M4.125 12.375H19.875M4.125 6.375H19.875" /><path className={styles.menuCloseIcon} d="M18 6L6 18M6 6L18 18" /></svg></button>;
}
