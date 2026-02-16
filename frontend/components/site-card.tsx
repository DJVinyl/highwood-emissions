'use client';
import { Card, CardContent, Typography, Chip, LinearProgress, Button, Stack, Box } from '@mui/material';
import { ShowChart as ShowChartIcon } from '@mui/icons-material';
import { Site } from '@highwood/shared';
import Link from 'next/link';

interface SiteCardProps {
  site: Site;
}

export function SiteCard({ site }: SiteCardProps) {
  const percentageUsed = (site.totalEmissionsToDate / site.emissionLimit) * 100;
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

  return (
    <Card
      sx={{
        height: '100',
        transition: 'border-color 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
        },
        width: 300,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {site.name}
              </Typography>
              {site.coordinates && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {`lat: ${site.coordinates.latitude.toFixed(2)} long: ${site.coordinates.longitude.toFixed(2)} `}
                  </Typography>
                </Stack>
              )}
            </Box>
            <Chip
              label={isOverLimit ? 'Limit Exceeded' : isNearLimit ? 'Warning' : 'Within Limit'}
              color={getStatusColor()}
              size="small"
            />
          </Stack>

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {'Total Emissions'}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                {site.totalEmissionsToDate.toFixed(2)} / {site.emissionLimit.toFixed(2)}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Math.min(percentageUsed, 100)}
              color={getProgressColor()}
              sx={{ height: 8, borderRadius: 1 }}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {percentageUsed.toFixed(1)}% of limit
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {(site.emissionLimit - site.totalEmissionsToDate).toFixed(2)} remaining
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
            <Button
              component={Link}
              href={`/sites/${site.id}/metrics`}
              variant="outlined"
              size="small"
              fullWidth
              startIcon={<ShowChartIcon />}
            >
              {'View Metrics'}
            </Button>
            <Button component={Link} href={`/sites/${site.id}/ingest`} variant="contained" size="small" fullWidth>
              {'Ingest Data'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
