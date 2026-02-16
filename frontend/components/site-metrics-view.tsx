'use client';

import { useCallback, useEffect, useState } from 'react';
import { SiteMetrics } from '@highwood/shared';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  AlertTitle,
  Button,
  Stack,
  Box,
  Grid,
  LinearProgress,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  ShowChart as ShowChartIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { apiClient } from '../lib/api-client';

interface SiteMetricsViewProps {
  siteId: string;
}

export function SiteMetricsView({ siteId }: SiteMetricsViewProps) {
  const [metrics, setMetrics] = useState<SiteMetrics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await apiClient.getSiteMetrics(siteId);

    if (response.success && response.data) {
      setMetrics(response.data);
    } else {
      setError(response.error?.message || 'Failed to fetch metrics');
    }

    setLoading(false);
  }, [siteId]);

  useEffect(() => {
    async function fetchData() {
      await fetchMetrics();
    }
    fetchData();
  }, [fetchMetrics]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        icon={<ErrorIcon />}
        action={
          <Button color="inherit" size="small" onClick={fetchMetrics}>
            {'Retry'}
          </Button>
        }
      >
        <AlertTitle>{'Error loading metrics'}</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (!metrics) {
    return (
      <Alert severity="info">
        <AlertTitle>{'No metrics available'}</AlertTitle>
        {'There are no metrics available for this site yet.'}
      </Alert>
    );
  }

  const percentageUsed = (metrics.site.totalEmissionsToDate / metrics.site.emissionLimit) * 100;
  const isOverLimit = percentageUsed > 100;
  const isNearLimit = percentageUsed > 80 && !isOverLimit;

  const getStatusColor = () => {
    if (isOverLimit) {
      return 'error';
    }
    if (isNearLimit) {
      return 'warning';
    }
    return 'success';
  };

  const getProgressColor = () => {
    if (isOverLimit) {
      return 'error';
    }
    if (isNearLimit) {
      return 'warning';
    }
    return 'primary';
  };

  const getStatusIcon = () => {
    if (metrics.site.isCompliant) {
      return <ErrorIcon />;
    }
    if (isNearLimit) {
      return <WarningIcon />;
    }
    return <CheckCircleIcon />;
  };

  const columns: GridColDef[] = [
    {
      field: 'takenAt',
      headerName: 'Timestamp',
      flex: 1,
      minWidth: 200,
      valueFormatter: (value) => {
        return new Date(value).toLocaleString();
      },
    },
    {
      field: 'reading',
      headerName: 'Reading Value (kg CH₄)',
      flex: 1,
      minWidth: 180,
      valueFormatter: (value: number | string) => {
        return typeof value === 'number' ? value.toFixed(2) : value;
      },
    },
  ];

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {'Site Information'}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {'Site Name'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                {metrics.site.name}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                {'Site ID'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
                {metrics.site.id}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                {'Latitude'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                {metrics.site.coordinates.latitude}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {'Longitude'}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                {metrics.site.coordinates.longitude}
              </Typography>
            </Box>
          </Grid>
        </CardContent>
      </Card>

      <Box>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  {getStatusIcon()}
                  <Typography variant="h6">{'Compliance Status'}</Typography>
                  <Chip
                    label={isOverLimit ? 'Limit Exceeded' : isNearLimit ? 'Warning' : 'Within Limit'}
                    color={getStatusColor()}
                    size="small"
                  />
                </Stack>
              </Stack>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {'Emission Utilization'}
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    {percentageUsed.toFixed(1)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(percentageUsed, 100)}
                  color={getProgressColor()}
                  sx={{ height: 10, borderRadius: 1 }}
                />
              </Box>

              {isNearLimit && (
                <Alert severity="warning">{'Warning: Site is approaching emission limit threshold'}</Alert>
              )}

              {!metrics.site.isCompliant && (
                <Alert severity="error">{'Site has exceeded the allowed emission limit'}</Alert>
              )}

              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchMetrics} disabled={loading}>
                {'Refresh Metrics'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Grid container spacing={3}>
        <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ShowChartIcon fontSize="small" color="action" />
              <Typography variant="overline" color="text.secondary">
                {'Total Emissions'}
              </Typography>
            </Stack>
            <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {metrics.site.totalEmissionsToDate.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {'kg CH₄'}
            </Typography>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <TrendingUpIcon fontSize="small" color="action" />
              <Typography variant="overline" color="text.secondary">
                {'Emission Limit'}
              </Typography>
            </Stack>
            <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {metrics.site.emissionLimit.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {'kg CH₄ maximum'}
            </Typography>
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <TrendingUpIcon fontSize="small" color={getStatusColor()} />
              <Typography variant="overline" color={getStatusColor()}>
                {'Remaining Emissions'}
              </Typography>
            </Stack>
            <Typography variant="h4" color={getStatusColor()} sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {(metrics.site.emissionLimit - metrics.site.totalEmissionsToDate).toFixed(2)}
            </Typography>
            <Typography variant="caption" color={getStatusColor()}>
              {'kg CH₄ maximum'}
            </Typography>
          </Stack>
        </Paper>

        {/* 
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarIcon fontSize="small" color="action" />
                <Typography variant="overline" color="text.secondary">
                  {'Last Reading'}
                </Typography>
              </Stack>
              <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                {metrics.
                  ? new Date(metrics.last_reading_timestamp).toLocaleDateString()
                  : 'No readings'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {metrics.last_reading_timestamp ? new Date(metrics.last_reading_timestamp).toLocaleTimeString() : 'N/A'}
              </Typography>
            </Stack>
          </Paper> */}
      </Grid>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <StorageIcon color="action" />
              <Typography variant="h6">{'Site Measurements & Readings'}</Typography>
            </Stack>
            <Divider />
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={metrics.measurements}
                columns={columns}
                loading={loading}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 25, page: 0 },
                  },
                  sorting: {
                    sortModel: [{ field: 'timestamp', sort: 'desc' }],
                  },
                }}
                sx={{
                  '& .MuiDataGrid-row:nth-of-type(even)': {
                    bgcolor: 'action.hover',
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                  '& .MuiDataGrid-row:hover': {
                    bgcolor: 'action.selected',
                  },
                }}
                disableRowSelectionOnClick
                disableColumnMenu
              />
            </Box>
            {metrics.measurements.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  {'No readings available for this site yet.'}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
