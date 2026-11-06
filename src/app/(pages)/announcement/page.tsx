import type { Metadata } from "next";
import AnnouncementListPage from "@/src/features/announcement/components/AnnouncementListPage";
import { announcements } from "@/src/features/announcement/announcement.data";

export const metadata: Metadata = {
  title: "公告",
  description: "查看網站使用說明、內容更新與網站調整的示範公告。",
};

export default function Page() {
  return <AnnouncementListPage announcements={announcements} />;
}
