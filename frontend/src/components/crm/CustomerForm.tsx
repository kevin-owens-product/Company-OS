import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Customer, CustomerType, CustomerStatus } from '@/types/crm';
import { CreateCustomerDto } from '@/services/crm/customer.service';

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCustomerDto) => Promise<void>;
  initialData?: Customer;
  isEdit?: boolean;
}

export default function CustomerForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}: CustomerFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerDto>({
    defaultValues: initialData || {
      name: '',
      type: CustomerType.INDIVIDUAL,
      status: CustomerStatus.LEAD,
      email: '',
      phone: '',
      address: '',
      companyDetails: {},
      contactDetails: {},
      tags: [],
      notes: '',
    },
  });

  const handleFormSubmit = async (data: CreateCustomerDto) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting customer form:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? t('crm.customers.edit') : t('crm.customers.add')}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.customers.name')}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={t('crm.customers.type')}
                    fullWidth
                  >
                    {Object.values(CustomerType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {t(`crm.customers.type.${type.toLowerCase()}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={t('crm.customers.status')}
                    fullWidth
                  >
                    {Object.values(CustomerStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {t(`crm.customers.status.${status.toLowerCase()}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.customers.email')}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.customers.phone')}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.customers.address')}
                    fullWidth
                    multiline
                    rows={2}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                {t('crm.customers.companyDetails')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="companyDetails.registrationNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('crm.customers.registrationNumber')}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="companyDetails.taxId"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('crm.customers.taxId')}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.customers.notes')}
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 