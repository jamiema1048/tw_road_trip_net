import data from "@/src/data/announcements.json";
import type { Announcement } from "./announcement.types";

export const announcements: Announcement[] = [...data].sort(
  (a, b) => b.date.localeCompare(a.date) || Number(b.id) - Number(a.id),
);

export function getAnnouncement(id: string) {
  return announcements.find((announcement) => announcement.id === id);
}

export function getAdjacentAnnouncements(id: string) {
  const index = announcements.findIndex((announcement) => announcement.id === id);
  return {
    previous: index > 0 ? announcements[index - 1] : undefined,
    next: index >= 0 ? announcements[index + 1] : undefined,
  };
}

export function formatAnnouncementDate(date: string) {
  return date.replaceAll("-", ".");
}
