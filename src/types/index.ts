export interface AttachmentMeta {
  fileName: string;
  mimeType: string;
  size: number;
  updatedAt: Date;
}

export interface Application {
  id: string;
  companyName: string;
  companyWebsite?: string;
  jobTitle: string;
  applicationDate: Date;
  status: ApplicationStatus;
  notes?: string;
  jobLink?: string;
  resumeBlob?: Blob;
  resumeMeta?: AttachmentMeta;
  coverLetterBlob?: Blob;
  coverLetterMeta?: AttachmentMeta;
  createdAt: Date;
  updatedAt: Date;
}

export enum ApplicationStatus {
  APPLIED = "Applied",
  INTERVIEW = "Interview",
  OFFER = "Offer",
  REJECTED = "Rejected",
  WITHDRAWN = "Withdrawn",
}

export interface ApplicationFormData {
  companyName: string;
  companyWebsite?: string;
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
