import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementDetailPage from "@/src/features/announcement/components/AnnouncementDetailPage";
import {
  announcements,
  getAnnouncement,
  getAdjacentAnnouncements,
} from "@/src/features/announcement/announcement.data";

interface Props {
  params: Promise<{ announcementId: string }>;
}

export function generateStaticParams() {
  return announcements.map(({ id }) => ({ announcementId: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { announcementId } = await params;
  const announcement = getAnnouncement(announcementId);
  if (!announcement) notFound();
  return { title: announcement.title, description: announcement.summary };
}

export default async function Page({ params }: Props) {
  const { announcementId } = await params;
  const announcement = getAnnouncement(announcementId);
  if (!announcement) notFound();

  return (
    <AnnouncementDetailPage
      announcement={announcement}
      {...getAdjacentAnnouncements(announcementId)}
    />
  );
}
