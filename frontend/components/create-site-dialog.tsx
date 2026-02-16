'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { SiteType } from '@highwood/shared';

import { apiClient } from '../lib/api-client';

interface CreateSiteDialogProps {
  onSiteCreated?: () => void;
}

export function CreateSiteDialog({ onSiteCreated }: CreateSiteDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const defaultFormState = {
    name: '',
    emissionLimit: '',

    latitude: 0,
    longitude: 0,

    totalEmissionsToDate: '',
    siteType: SiteType.WELL,
  };

  const [formData, setFormData] = useState(defaultFormState);

  const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await apiClient.createSite({
      name: formData.name,
      emissionLimit: parseFloat(formData.emissionLimit),
      coordinates: {
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      totalEmissionsToDate: parseFloat(formData.totalEmissionsToDate),
      siteType: formData.siteType,
    });

    setLoading(false);

    if (response.success) {
      setSnackbar({
        open: true,
        message: `${formData.name} has been successfully created.`,
        severity: 'success',
      });
      setOpen(false);
      setFormData(defaultFormState);
      onSiteCreated?.();
    } else {
      setSnackbar({
        open: true,
        message: response.error?.message || 'An error occurred',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        {'Create Site'}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{'Create New Site'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3}>
              <Typography variant="body2" color="text.secondary">
                {'Add a new industrial site to monitor for methane emissions.'}
              </Typography>
              <TextField
                label="Site Name"
                placeholder="e.g., Well Well Well"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <TextField
                  label="Latitude"
                  type="number"
                  inputProps={{ step: '0.01' }}
                  placeholder="e.g 49.123"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: +e.target.value })}
                  required
                />
                <TextField
                  label="Longitude"
                  type="number"
                  inputProps={{ step: '0.01' }}
                  placeholder="e.g., -114.432"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: +e.target.value })}
                  required
                />
              </Grid>

              <TextField
                label="Emission Limit (kg CH₄)"
                type="number"
                inputProps={{ step: '0.01' }}
                placeholder="e.g., 1000.00"
                value={formData.emissionLimit}
                onChange={(e) => setFormData({ ...formData, emissionLimit: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Emissions to Date"
                type="number"
                inputProps={{ step: '0.01' }}
                placeholder="e.g., -114.432"
                value={formData.totalEmissionsToDate}
                onChange={(e) => setFormData({ ...formData, totalEmissionsToDate: e.target.value })}
                required
              />

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Site Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={SiteType.WELL}
                  label="Site Type"
                  onChange={(e) => setFormData({ ...formData, siteType: e.target.value })}
                >
                  <MenuItem value={SiteType.WELL}>Well</MenuItem>
                  <MenuItem value={SiteType.REFINERY}>Refinery</MenuItem>
                  <MenuItem value={SiteType.PROCESSING_PLANT}>Processing Plant</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>{'Cancel'}</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Creating...' : 'Create Site'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

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
    </>
  );
}
