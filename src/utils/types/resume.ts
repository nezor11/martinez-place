import type { Section } from "@/utils/types/section";

export interface Resume {
  _id: string;
  title: string;
  _updatedAt: string;
  pageBuilder: Section[];
  slug: string;
}
