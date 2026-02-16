'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, IconButton, Stack, Paper, CircularProgress, Divider } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Site } from '@highwood/shared';
import Link from 'next/link';

import { ManualIngestForm } from '../../../../components/manual-ingest-form';
import { apiClient } from '../../../../lib/api-client';

export default function IngestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSite = async () => {
      const response = await apiClient.getAllSites();
      if (response.success && response.data) {
        const foundSite = response.data.find((s) => s.id === id);
        setSite(foundSite || null);
      }
      setLoading(false);
    };

    fetchSite();
  }, [id]);

  const handleSuccess = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <Box sx={{ height: 32, bgcolor: 'action.hover', borderRadius: 1, width: 256 }} />
          </Container>
        </Paper>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (!site) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {'Site not found'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {'The site you are looking for does not exist.'}
          </Typography>
          <Button component={Link} href="/" variant="contained" startIcon={<ArrowBackIcon />}>
            {'Back to Dashboard'}
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Paper
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton component={Link} href="/" size="small">
              <ArrowBackIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="h6" component="h1">
                {site.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {'Data Ingestion'}
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ManualIngestForm siteId={site.id} siteName={site.name} onSuccess={handleSuccess} />
      </Container>
    </Box>
  );
}
