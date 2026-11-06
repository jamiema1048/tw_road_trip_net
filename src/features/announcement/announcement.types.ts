export interface AnnouncementSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

export interface Announcement {
  id: string;
  date: string;
  category: string;
  title: string;
  summary: string;
  sections: AnnouncementSection[];
}
