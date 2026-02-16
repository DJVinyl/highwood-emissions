'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Alert,
  AlertTitle,
  Chip,
  Stack,
  Box,
  IconButton,
  Divider,
  Snackbar,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import type { CreateMeasurement } from '@highwood/shared';

import { apiClient } from '../lib/api-client';
import { indexedDBManager, generateIdempotencyKey, calculateBackoffDelay } from '../lib/index-db';

interface ManualIngestFormProps {
  siteId: string;
  siteName: string;
  onSuccess?: () => void;
}

export function ManualIngestForm({ siteId, siteName, onSuccess }: ManualIngestFormProps) {
  const [readings, setReadings] = useState<CreateMeasurement[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<{ success: boolean; message: string } | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [singleReading, setSingleReading] = useState({
    reading: '',
    takenAt: new Date().toISOString().slice(0, 16),
    siteId: '',
  });

  useEffect(() => {
    const loadPendingReadings = async () => {
      try {
        await indexedDBManager.init();
        const pending = await indexedDBManager.getPendingReadingsBySiteId(siteId);

        if (pending && pending.readings.length > 0) {
          const storedReadings: CreateMeasurement[] = pending.readings.map((reading) => ({
            takenAt: reading.takenAt,
            reading: reading.reading,
            siteId: reading.siteId,
          }));

          setReadings(storedReadings);
          setIdempotencyKey(pending.id);
          setRetryCount(pending.retryCount);

          setSnackbar({
            open: true,
            message: `Restored ${pending.readings.length} unsaved reading(s) from local storage`,
            severity: 'info',
          });
        } else {
          setIdempotencyKey(generateIdempotencyKey());
        }
      } catch (err) {
        console.error('Failed to load pending readings:', err);
        setIdempotencyKey(generateIdempotencyKey());
      }
    };

    loadPendingReadings();

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [siteId]);

  useEffect(() => {
    const saveToIndexedDB = async () => {
      if (readings.length > 0 && idempotencyKey) {
        try {
          await indexedDBManager.savePendingReadings({
            id: idempotencyKey,
            siteId,
            readings: readings.map((reading) => ({
              reading: reading.reading,
              takenAt: new Date(reading.takenAt),
              siteId: reading.siteId,
            })),
            createdAt: new Date(),
            retryCount,
          });
        } catch (err) {
          console.error('Failed to save to IndexedDB:', err);
        }
      }
    };

    saveToIndexedDB();
  }, [readings, idempotencyKey, siteId, siteName, retryCount]);

  const addSingleReading = () => {
    if (!singleReading.reading) {
      return;
    }

    const reading: CreateMeasurement = {
      reading: parseFloat(singleReading.reading),
      takenAt: new Date(singleReading.takenAt),
      siteId,
    };

    setReadings([...readings, reading]);
    setSingleReading({
      reading: '',
      takenAt: new Date().toISOString().slice(0, 16),
      siteId,
    });
  };

  const removeReading = async (index: number) => {
    const filteredReadings = readings.filter((_, i) => i !== index);
    setReadings(filteredReadings);

    if (idempotencyKey && filteredReadings.length > 0) {
      try {
        const dbReadings = filteredReadings.map((reading) => ({
          reading: reading.reading,
          takenAt: new Date(reading.takenAt),
          siteId: reading.siteId,
        }));

        await indexedDBManager.updateReadings(idempotencyKey, dbReadings);
      } catch (err) {
        console.error('Failed to update IndexedDB after removing reading:', err);
      }
    } else if (idempotencyKey && filteredReadings.length === 0) {
      try {
        await indexedDBManager.deletePendingReadings(idempotencyKey);
      } catch (err) {
        console.error('Failed to delete from IndexedDB:', err);
      }
    }
  };

  const handleSubmit = async (isRetry = false, currentRetryCount?: number) => {
    if (readings.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please add at least one reading',
        severity: 'error',
      });
      return;
    }

    if (readings.length > 100) {
      setSnackbar({
        open: true,
        message: 'Max number of ingestable readings  is 100',
        severity: 'error',
      });
      return;
    }

    setLoading(true);

    setLastResponse(null);

    const response = await apiClient.ingestReadings(readings);

    setLoading(false);

    if (response.data) {
      try {
        await indexedDBManager.deletePendingReadings(idempotencyKey);
      } catch (err) {
        console.error('Failed to delete from IndexedDB:', err);
      }

      setLastResponse({
        success: true,
        message: response.data && 'Readings ingested successfully',
      });
      setSnackbar({
        open: true,
        message: `${readings.length} reading(s) ingested successfully`,
        severity: 'success',
      });
      setReadings([]);
      setRetryCount(0);
      setIsRetrying(false);

      onSuccess?.();
    } else {
      const errorMsg = response.error?.message || 'Failed to ingest readings';

      setLastResponse({
        success: false,
        message: errorMsg,
      });

      if (!isRetry) {
        setSnackbar({
          open: true,
          message: 'Failed to ingest readings. Data saved locally for retry.',
          severity: 'error',
        });
      }

      const baseRetryCount = currentRetryCount !== undefined ? currentRetryCount : retryCount;
      const newRetryCount = baseRetryCount + 1;

      setRetryCount(newRetryCount);

      try {
        await indexedDBManager.updateRetryCount(idempotencyKey, newRetryCount);
      } catch (err) {
        console.error('Failed to update retry count:', err);
      }

      const delay = calculateBackoffDelay(newRetryCount);
      setIsRetrying(true);

      setSnackbar({
        open: true,
        message: `Will retry in ${Math.round(delay / 1000)} seconds... (Attempt ${newRetryCount})`,
        severity: 'info',
      });

      retryTimeoutRef.current = setTimeout(() => {
        handleSubmit(true, newRetryCount);
      }, delay);
    }
  };

  const handleRetry = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    setRetryCount(0);
    handleSubmit(false);
  };

  const handleCancelRetry = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
      setRetryCount(0);
    }
    setIsRetrying(false);
    setSnackbar({
      open: true,
      message: 'Automatic retry cancelled. Data is still saved locally.',
      severity: 'info',
    });
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h3" gutterBottom>
                {'Manual Data Ingestion'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {'Readings for'} <strong>{siteName}</strong>.
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {'Add Single Reading'}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label="Methane Value (kg CH₄)"
                  type="number"
                  inputProps={{ step: '0.01' }}
                  placeholder="e.g., 12.50"
                  value={singleReading.reading}
                  onChange={(e) => setSingleReading({ ...singleReading, reading: e.target.value })}
                  required
                  fullWidth
                  size="small"
                />

                <TextField
                  label="Taken At"
                  type="datetime-local"
                  value={singleReading.takenAt}
                  onChange={(e) => setSingleReading({ ...singleReading, takenAt: e.target.value })}
                  required
                  fullWidth
                  size="small"
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={addSingleReading}
                  disabled={!singleReading.reading && !singleReading.takenAt}
                  sx={{ height: '40px' }}
                >
                  {'Add Reading to Queue '}
                  <AddIcon />
                </Button>
              </Grid>
            </Box>
            <Divider />
          </Stack>
        </CardContent>
      </Card>

      {readings.length > 0 && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{'Readings Queue'}</Typography>
                <Chip
                  label={`${readings.length} / 100 readings`}
                  color={readings.length > 100 ? 'error' : 'primary'}
                  size="small"
                />
              </Box>

              <Stack spacing={1}>
                {readings.map((reading, index) => (
                  <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          {reading.reading} kg
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(reading.takenAt).toLocaleString()}
                        </Typography>
                      </Stack>
                      <IconButton
                        size="small"
                        onClick={() => removeReading(index)}
                        color="error"
                        disabled={loading || isRetrying}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Paper>
                ))}
              </Stack>

              {lastResponse && (
                <Alert
                  severity={lastResponse.success ? 'success' : 'error'}
                  icon={lastResponse.success ? <CheckCircleIcon /> : <ErrorIcon />}
                >
                  <AlertTitle>{lastResponse.success ? 'Success' : 'Error'}</AlertTitle>
                  {lastResponse.message}
                  {!lastResponse.success && (
                    <Button size="small" onClick={handleRetry} sx={{ mt: 1 }}>
                      {'Retry Now'}
                    </Button>
                  )}
                </Alert>
              )}

              {isRetrying && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">{`Automatic retry in progress. Attempt: ${retryCount}`}</Typography>
                  </Stack>
                </Alert>
              )}

              <Stack direction="row" spacing={1} sx={{ pt: 2 }}>
                {isRetrying ? (
                  <Button variant="outlined" onClick={handleCancelRetry} fullWidth color="warning">
                    {'Cancel Automatic Retry'}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => handleSubmit(false)}
                      disabled={loading || readings.length === 0 || readings.length > 100}
                      fullWidth
                    >
                      {loading ? 'Ingesting...' : `Ingest ${readings.length} Reading(s)`}
                    </Button>
                    <Button variant="outlined" onClick={() => setReadings([])} disabled={loading}>
                      {'Clear All'}
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {lastResponse && (
        <Alert
          severity={lastResponse.success ? 'success' : 'error'}
          icon={lastResponse.success ? <CheckCircleIcon /> : <ErrorIcon />}
          action={
            !lastResponse.success && (
              <Button color="inherit" size="small" onClick={handleRetry}>
                {'Retry'}
              </Button>
            )
          }
        >
          <AlertTitle>{lastResponse.success ? 'Success' : 'Error'}</AlertTitle>
          {lastResponse.message}
        </Alert>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
