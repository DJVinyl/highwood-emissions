'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Grid,
  Skeleton,
  Paper,
  IconButton,
  Stack,
} from '@mui/material';
import { Refresh as RefreshIcon, Error as ErrorIcon } from '@mui/icons-material';
import { SiteCard } from '../components/site-card';
import { CreateSiteDialog } from '../components/create-site-dialog';
import { useSites } from '../hooks/use-sites';

export default function DashboardPage() {
  const { sites, loading, error, refetch } = useSites();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Paper
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.paper',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.1,
                }}
              ></Box>
              <Box>
                <Typography variant="h6" component="h1">
                  {'Emissions Dashboard'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {'Real-time methane monitoring'}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={refetch} disabled={loading} color="primary">
                <RefreshIcon
                  sx={{
                    animation: loading ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              </IconButton>
              <CreateSiteDialog onSiteCreated={refetch} />
            </Stack>
          </Stack>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && (
          <Alert
            severity="error"
            icon={<ErrorIcon />}
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={refetch}>
                {'Retry'}
              </Button>
            }
          >
            <AlertTitle>{'Error loading sites'}</AlertTitle>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" component="h2">
                {'Industrial Sites'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {loading ? 'Loading sites...' : `${sites.length} site${sites.length !== 1 ? 's' : ''} monitored`}
              </Typography>
            </Box>
          </Stack>

          {loading && (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, i) => (
                <Skeleton variant="rounded" height={300} key={i} />
              ))}
            </Grid>
          )}

          {!loading && sites.length === 0 && !error && (
            <Paper
              variant="outlined"
              sx={{
                py: 8,
                textAlign: 'center',
                borderStyle: 'dashed',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {'No sites yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {'Create your first site to start monitoring emissions.'}
              </Typography>
              <CreateSiteDialog onSiteCreated={refetch} />
            </Paper>
          )}

          {!loading && sites.length > 0 && (
            <Grid container spacing={3}>
              {sites.map((site) => (
                <SiteCard site={site} key={site.id} />
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
