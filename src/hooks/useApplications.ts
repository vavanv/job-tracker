import { useState, useEffect, useCallback } from "react";
import type { Application, FilterOptions } from "../types";
import { ApplicationStatus } from "../types";
import * as db from "../utils/indexedDB";
import { INITIAL_FILTER_OPTIONS } from "../utils/constants";

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTER_OPTIONS);

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await db.getAllApplications();
      setApplications(data);
      setFilteredApplications(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const addApplication = useCallback(
    async (
      applicationData: Omit<Application, "id" | "createdAt" | "updatedAt">
    ) => {
      try {
        const id = await db.addApplication(applicationData);
        await loadApplications();
        return id;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to add application"
        );
        throw err;
      }
    },
    [loadApplications]
  );

  const updateApplication = useCallback(
    async (id: string, updates: Partial<Application>) => {
      try {
        await db.updateApplication(id, updates);
        await loadApplications();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update application"
        );
        throw err;
      }
    },
    [loadApplications]
  );

  const deleteApplication = useCallback(
    async (id: string) => {
      try {
        await db.deleteApplication(id);
        await loadApplications();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete application"
        );
        throw err;
      }
    },
    [loadApplications]
  );

  const duplicateApplication = useCallback(
    async (application: Application) => {
      try {
        const { id: _, createdAt, updatedAt, ...appData } = application;
        const duplicatedApp = {
          ...appData,
          companyName: `${appData.companyName} (Copy)`,
          status: ApplicationStatus.APPLIED
        };
        
        const newId = await db.addApplication(duplicatedApp);
        await loadApplications();
        return newId;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to duplicate application"
        );
        throw err;
      }
    },
    [loadApplications]
  );

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...applications];

    // Apply search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.companyName.toLowerCase().includes(searchLower) ||
          app.jobTitle.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((app) => app.status === filters.status);
    }

    // Apply date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(
        (app) => new Date(app.applicationDate) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filtered = filtered.filter(
        (app) => new Date(app.applicationDate) <= toDate
      );
    }

    setFilteredApplications(filtered);
  }, [applications, filters]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getStats = useCallback(() => {
    const stats = {
      total: applications.length,
      applied: applications.filter(
        (app) => app.status === ApplicationStatus.APPLIED
      ).length,
      interview: applications.filter(
        (app) => app.status === ApplicationStatus.INTERVIEW
      ).length,
      offer: applications.filter(
        (app) => app.status === ApplicationStatus.OFFER
      ).length,
      rejected: applications.filter(
        (app) => app.status === ApplicationStatus.REJECTED
      ).length,
      withdrawn: applications.filter(
        (app) => app.status === ApplicationStatus.WITHDRAWN
      ).length,
    };
    return stats;
  }, [applications]);

  return {
    applications: filteredApplications,
    allApplications: applications,
    loading,
    error,
    filters,
    addApplication,
    updateApplication,
    deleteApplication,
    duplicateApplication,
    updateFilters,
    getStats,
    refresh: loadApplications,
  };
};
