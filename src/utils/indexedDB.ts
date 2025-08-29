import { openDB } from "idb";
import type { IDBPDatabase } from "idb";
import type { Application } from "../types";
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  STORE_NAME,
  SETTINGS_STORE_NAME,
} from "./constants";

let db: IDBPDatabase | null = null;

export const initDB = async (): Promise<IDBPDatabase> => {
  if (db) return db;

  db = await openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("companyName", "companyName", { unique: false });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("applicationDate", "applicationDate", {
          unique: false,
        });
      }
      // v2: attachments stored inside Application objects as Blob and metadata fields
      // No new stores or indexes required; existing store remains compatible

      // v3: Add settings store for theme preferences
      if (oldVersion < 3) {
        if (!db.objectStoreNames.contains(SETTINGS_STORE_NAME)) {
          db.createObjectStore(SETTINGS_STORE_NAME, { keyPath: "key" });
        }
      }
    },
  });

  return db;
};

export const addApplication = async (
  application: Omit<Application, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const database = await initDB();
  const id = crypto.randomUUID();
  const now = new Date();

  const newApplication: Application = {
    ...application,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await database.add(STORE_NAME, newApplication);
  return id;
};

export const updateApplication = async (
  id: string,
  updates: Partial<Omit<Application, "id" | "createdAt">>
): Promise<void> => {
  console.log("updateApplication called with id:", id);
  console.log("updateApplication called with updates:", updates);

  const database = await initDB();
  const existing = await database.get(STORE_NAME, id);

  if (!existing) {
    console.error("Application not found with id:", id);
    throw new Error("Application not found");
  }

  console.log("Existing application:", existing);

  const updatedApplication: Application = {
    ...existing,
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date(),
  };

  console.log("Updated application to be saved:", updatedApplication);

  await database.put(STORE_NAME, updatedApplication);

  console.log("Application updated successfully in database");
};

export const deleteApplication = async (id: string): Promise<void> => {
  (await initDB()).delete(STORE_NAME, id);
};

export const getApplication = async (
  id: string
): Promise<Application | undefined> => {
  return (await initDB()).get(STORE_NAME, id);
};

export const getAllApplications = async (): Promise<Application[]> => {
  return (await initDB()).getAll(STORE_NAME);
};

export const searchApplications = async (
  query: string
): Promise<Application[]> => {
  const database = await initDB();
  const all = await database.getAll(STORE_NAME);

  if (!query.trim()) return all;

  const lowerQuery = query.toLowerCase();
  return all.filter(
    (app) =>
      app.companyName.toLowerCase().includes(lowerQuery) ||
      app.jobTitle.toLowerCase().includes(lowerQuery)
  );
};

export const filterApplicationsByStatus = async (
  status: string
): Promise<Application[]> => {
  const database = await initDB();
  const all = await database.getAll(STORE_NAME);

  if (status === "all") return all;

  return all.filter((app) => app.status === status);
};

// Export all applications as JSON
export const exportApplicationsAsJSON = async (): Promise<string> => {
  const applications = await getAllApplications();

  // Convert applications to a serializable format
  const exportData = await Promise.all(
    applications.map(async (app) => ({
      ...app,
      // Convert dates to ISO strings for JSON serialization
      applicationDate: app.applicationDate.toISOString(),
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
      // Convert Blobs to base64 strings for JSON serialization
      resumeBlob: app.resumeBlob
        ? await blobToBase64(app.resumeBlob)
        : undefined,
      coverLetterBlob: app.coverLetterBlob
        ? await blobToBase64(app.coverLetterBlob)
        : undefined,
      // Include metadata as-is
      resumeMeta: app.resumeMeta
        ? {
            ...app.resumeMeta,
            updatedAt: app.resumeMeta.updatedAt.toISOString(),
          }
        : undefined,
      coverLetterMeta: app.coverLetterMeta
        ? {
            ...app.coverLetterMeta,
            updatedAt: app.coverLetterMeta.updatedAt.toISOString(),
          }
        : undefined,
    }))
  );

  return JSON.stringify(
    {
      version: "1.0",
      exportDate: new Date().toISOString(),
      applications: exportData,
    },
    null,
    2
  );
};

// Import applications from JSON
export const importApplicationsFromJSON = async (
  jsonData: string
): Promise<{ imported: number; errors: string[] }> => {
  try {
    const data = JSON.parse(jsonData);

    let applicationsData: any[] = [];

    // Support both formats: original format with 'applications' array and new format with 'jobs' array
    if (data.applications && Array.isArray(data.applications)) {
      applicationsData = data.applications;
    } else if (data.jobs && Array.isArray(data.jobs)) {
      // Map the new format to our existing format
      applicationsData = data.jobs.map((job: any) => ({
        id: job.id?.toString() || crypto.randomUUID(),
        companyName: job.company?.replace(/`/g, "").trim() || "",
        companyWebsite: job.company?.includes("http")
          ? job.company.replace(/`/g, "").trim()
          : undefined,
        jobTitle: job.position || "",
        applicationDate: job.dateApplied || job.createdAt,
        status: job.status || "Applied",
        notes: [job.notes, job.salaryRange, job.jobType, job.location]
          .filter(Boolean)
          .join("\n"),
        jobLink: job.url?.replace(/`/g, "").trim() || undefined,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
        // Handle resume data if present (will be processed later)
        resumeData:
          job.resume?.data && job.resume.data.trim()
            ? job.resume.data
            : undefined,
        resumeMeta:
          job.resume && job.resume.data && job.resume.data.trim()
            ? {
                fileName: job.resume.name || "resume.pdf",
                mimeType: job.resume.type || "application/pdf",
                size: job.resume.size || 0,
                updatedAt: job.updatedAt || job.createdAt,
              }
            : undefined,
        // Handle cover letter data if present
        coverLetterData:
          job.coverLetter?.data && job.coverLetter.data.trim()
            ? job.coverLetter.data
            : undefined,
        coverLetterMeta:
          job.coverLetter && job.coverLetter.data && job.coverLetter.data.trim()
            ? {
                fileName: job.coverLetter.name || "cover-letter.docx",
                mimeType:
                  job.coverLetter.type ||
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                size: job.coverLetter.size || 0,
                updatedAt: job.updatedAt || job.createdAt,
              }
            : undefined,
      }));
    } else {
      throw new Error(
        "Invalid JSON format: missing applications or jobs array"
      );
    }

    const database = await initDB();
    const errors: string[] = [];
    let imported = 0;

    for (const appData of applicationsData) {
      try {
        // Validate required fields
        if (
          !appData.companyName ||
          !appData.jobTitle ||
          !appData.applicationDate
        ) {
          errors.push(
            `Skipping application: missing required fields (companyName, jobTitle, or applicationDate)`
          );
          continue;
        }

        // Convert date strings back to Date objects
        const application: Application = {
          ...appData,
          id: appData.id || crypto.randomUUID(), // Generate new ID if missing
          applicationDate: new Date(appData.applicationDate),
          createdAt: appData.createdAt
            ? new Date(appData.createdAt)
            : new Date(),
          updatedAt: new Date(), // Always update to current time on import
          // Convert base64 strings back to Blobs
          resumeBlob:
            appData.resumeBlob && typeof appData.resumeBlob === "string"
              ? await base64ToBlob(appData.resumeBlob)
              : appData.resumeData
              ? await base64ToBlob(
                  appData.resumeData,
                  appData.resumeMeta?.mimeType
                )
              : undefined,
          coverLetterBlob:
            appData.coverLetterBlob &&
            typeof appData.coverLetterBlob === "string"
              ? await base64ToBlob(appData.coverLetterBlob)
              : appData.coverLetterData
              ? await base64ToBlob(
                  appData.coverLetterData,
                  appData.coverLetterMeta?.mimeType
                )
              : undefined,
          // Convert metadata dates back to Date objects
          resumeMeta: appData.resumeMeta
            ? {
                ...appData.resumeMeta,
                updatedAt: new Date(appData.resumeMeta.updatedAt),
              }
            : undefined,
          coverLetterMeta: appData.coverLetterMeta
            ? {
                ...appData.coverLetterMeta,
                updatedAt: new Date(appData.coverLetterMeta.updatedAt),
              }
            : undefined,
        };

        // Remove temporary data fields
        delete (application as any).resumeData;
        delete (application as any).coverLetterData;

        // Check if application with this ID already exists
        const existing = await database.get(STORE_NAME, application.id);
        if (existing) {
          // Update existing application
          await database.put(STORE_NAME, application);
        } else {
          // Add new application
          await database.add(STORE_NAME, application);
        }

        imported++;
      } catch (error) {
        errors.push(
          `Failed to import application "${appData.companyName} - ${
            appData.jobTitle
          }": ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return { imported, errors };
  } catch (error) {
    throw new Error(
      `Failed to parse JSON: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Helper function to convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Helper function to convert base64 to Blob
const base64ToBlob = async (
  base64: string,
  mimeType: string = "application/octet-stream"
): Promise<Blob> => {
  const response = await fetch(`data:${mimeType};base64,${base64}`);
  return response.blob();
};

// Clear all applications (for testing or reset purposes)
export const clearAllApplications = async (): Promise<void> => {
  const database = await initDB();
  const tx = database.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
};

// Settings functions for theme preferences
export const saveSetting = async (key: string, value: any): Promise<void> => {
  const database = await initDB();
  await database.put(SETTINGS_STORE_NAME, { key, value });
};

export const getSetting = async (key: string): Promise<any> => {
  const database = await initDB();
  const setting = await database.get(SETTINGS_STORE_NAME, key);
  return setting ? setting.value : null;
};

export const getAllSettings = async (): Promise<Record<string, any>> => {
  const database = await initDB();
  const settings = await database.getAll(SETTINGS_STORE_NAME);
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, any>);
};
