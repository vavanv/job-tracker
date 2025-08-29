import { ApplicationStatus } from "../types";

export const STATUS_COLORS = {
  [ApplicationStatus.APPLIED]: "#1976d2", // Blue
  [ApplicationStatus.INTERVIEW]: "#ed6c02", // Orange
  [ApplicationStatus.OFFER]: "#2e7d32", // Green
  [ApplicationStatus.REJECTED]: "#d32f2f", // Red
  [ApplicationStatus.WITHDRAWN]: "#757575", // Gray
};

export const DATABASE_NAME = "JobApplicationTracker";
export const DATABASE_VERSION = 3;
export const STORE_NAME = "applications";
export const SETTINGS_STORE_NAME = "settings";

export const INITIAL_FILTER_OPTIONS = {
  search: "",
  status: "all" as const,
  dateFrom: "",
  dateTo: "",
};
