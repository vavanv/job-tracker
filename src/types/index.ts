export interface AttachmentMeta {
  fileName: string;
  mimeType: string;
  size: number;
  updatedAt: Date;
}

export interface Application {
  id: string;
  companyName: string;
  companyWebsite?: string; // normalized URL for external link
  jobTitle: string;
  applicationDate: Date;
  status: ApplicationStatus;
  notes?: string;
  jobLink?: string;
  resumeBlob?: Blob; // binary content
  resumeMeta?: AttachmentMeta;
  coverLetterBlob?: Blob; // binary content
  coverLetterMeta?: AttachmentMeta;
  createdAt: Date;
  updatedAt: Date;
}

export const ApplicationStatus = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export interface ApplicationFormData {
  companyName: string;
  companyWebsite: string;
  jobTitle: string;
  applicationDate: string;
  status: ApplicationStatus;
  notes: string;
  jobLink: string;
}

export interface Stats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
}

export interface FilterOptions {
  search: string;
  status: ApplicationStatus | "all";
  dateFrom?: string;
  dateTo?: string;
}
