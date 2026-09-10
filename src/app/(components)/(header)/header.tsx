import Link from "next/link";
import HeaderSearchBar from "@/src/app/(components)/(header)/HeaderSearchBar";
import MobileMenuToggle from "@/src/app/(components)/(header)/MobileMenuToggle";
import { ThemeToggle } from "@/src/app/(components)/(header)/(button)/ThemeToggle";
import styles from "@/src/styles/components/header/Header.module.css";

export interface ComponentHeaderProps {
  className?: string;
}

function LogoIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 840" className={styles.svgIcon}><path d="M396.37 309.5H444.37V485.5C444.37 498.755 433.625 509.5 420.37 509.5C407.115 509.5 396.37 498.755 396.37 485.5V309.5Z" /><path d="M280.37 285.5C280.37 272.245 291.115 261.5 304.37 261.5H536.37C549.625 261.5 560.37 272.245 560.37 285.5C560.37 298.755 549.625 309.5 536.37 285.5Z" /><path d="M278.37 655.5H562.37L491.37 524.5H349.37L278.37 655.5Z" /><path d="M741.666 185C780.156 185 804.212 226.667 784.967 260L564.616 641.657L530.791 579.245L686.24 310C705.485 276.667 681.428 235 642.938 235H197.802C159.312 235 135.255 276.667 154.5 310L309.948 579.244L276.123 641.657L55.7733 260C36.5282 226.667 60.585 185 99.075 185H741.666Z" /></svg>;
}

function HomeIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={styles.svgIcon}><path d="M12 38H18V28C18 27.4333 18.192 26.9587 18.576 26.576C18.96 26.1933 19.4347 26.0013 20 26H28C28.5667 26 29.042 26.192 29.426 26.576C29.81 26.96 30.0013 27.4347 30 28V38H36V20L24 11L12 20V38ZM8 38V20C8 19.3667 8.142 18.7667 8.426 18.2C8.71 17.6333 9.10133 17.1667 9.6 16.8L21.6 7.8C22.3 7.26667 23.1 7 24 7C24.9 7 25.7 7.26667 26.4 7.8L38.4 16.8C38.9 17.1667 39.292 17.1667 39.576 18.2C39.86 18.7667 40.0013 19.3667 40 20V38C40 39.1 39.608 40.042 38.824 40.826C38.04 41.61 37.0987 42.0013 36 42H28C27.4333 42 26.9587 41.808 26.576 41.424C26.1933 41.04 26.0013 40.5653 26 40V30H22V40C22 40.5667 21.808 41.042 21.424 41.424C21.04 41.81 20.5653 42.0013 20 42H12C10.9 42 9.95867 41.6087 9.176 40.826C8.39333 40.0433 8.00133 39.1013 8 38Z" /></svg>;
}

export default function Header({ className = "" }: ComponentHeaderProps) {
  return <header className={`${styles.header} component-header ${className}`.trim()}>
    <div className={styles.headerMainArea}>
      <Link href="/" className={`${styles.iconButton} component-cell-header-search`} aria-label="Logo"><LogoIcon /></Link>
      <div className={styles.headerTools}>
        <HeaderSearchBar />
        <Link href="/highways" className={`${styles.navTextButton} text-wrapper`}>公路旅途</Link>
        <Link href="/railways" className={`${styles.navTextButton} text-wrapper`}>車站旅途</Link>
        <ThemeToggle />
        <Link href="/" className={`${styles.homeButton} icon-home`} aria-label="回首頁"><HomeIcon /></Link>
        <MobileMenuToggle />
      </div>
    </div>
    <nav className={styles.menuContainer} aria-label="手機版選單">
      <div className={styles.menuContent}>
        <Link href="/" className={`${styles.dropListHomeButton} icon-home`} aria-label="回首頁" data-mobile-menu-link><HomeIcon /></Link>
        <Link href="/highways" className={`${styles.dropListTextButton} text-wrapper`} data-mobile-menu-link>公路旅途</Link>
        <Link href="/railways" className={`${styles.dropListTextButton} text-wrapper`} data-mobile-menu-link>車站旅途</Link>
      </div>
    </nav>
  </header>;
}
