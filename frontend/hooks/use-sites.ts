'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Site } from '@highwood/shared';

import { apiClient } from '../lib/api-client';

const POLLING_INTERVAL_IN_MS = 10_000;

export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSites = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);

    const response = await apiClient.getAllSites();

    if (response.success && response.data) {
      setSites(response.data);
    } else {
      setError(response.error?.message || 'Failed to fetch sites');
    }

    if (isInitialLoad) {
      setLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      fetchSites(false);
    }, POLLING_INTERVAL_IN_MS);
  }, [fetchSites]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      await fetchSites(true);
    }
    fetchData();

    startPolling();

    return () => {
      stopPolling();
    };
  }, [fetchSites, startPolling, stopPolling]);

  return {
    sites,
    loading,
    error,
    refetch: () => fetchSites(true),
  };
}
