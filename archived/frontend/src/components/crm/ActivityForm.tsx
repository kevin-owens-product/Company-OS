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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Activity, ActivityType, ActivityStatus, ActivityPriority } from '@/types/crm';
import { CreateActivityDto } from '@/services/crm/activity.service';
import { DateTimePicker } from '@mui/x-date-pickers';

interface ActivityFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActivityDto) => Promise<void>;
  initialData?: Activity;
  isEdit?: boolean;
  customerId?: string;
  contactId?: string;
  opportunityId?: string;
}

export default function ActivityForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
  customerId,
  contactId,
  opportunityId,
}: ActivityFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateActivityDto>({
    defaultValues: initialData ? {
      type: initialData.type,
      subject: initialData.subject,
      description: initialData.description || '',
      scheduledAt: initialData.scheduledAt,
      completedAt: initialData.completedAt || null,
      status: initialData.status,
      priority: initialData.priority,
      duration: typeof initialData.duration === 'string' ? parseInt(initialData.duration) || 30 : initialData.duration || 30,
      outcome: typeof initialData.outcome === 'object' ? '' : (initialData.outcome || ''),
      location: typeof initialData.location === 'object' ? (initialData.location?.address || initialData.location?.link || '') : (initialData.location || ''),
      notes: initialData.notes || '',
      customerId: initialData.customerId,
      contactId: initialData.contactId || '',
      opportunityId: initialData.opportunityId || '',
    } : {
      type: ActivityType.MEETING,
      subject: '',
      description: '',
      scheduledAt: null,
      completedAt: null,
      status: ActivityStatus.PLANNED,
      priority: ActivityPriority.MEDIUM,
      duration: 30,
      outcome: '',
      location: '',
      notes: '',
      customerId: customerId || '',
      contactId: contactId || '',
      opportunityId: opportunityId || '',
    },
  });

  const handleFormSubmit = async (data: CreateActivityDto) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting activity form:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? t('crm.activities.edit') : t('crm.activities.add')}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={t('crm.activities.type')}
                    fullWidth
                  >
                    {Object.values(ActivityType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {t(`crm.activities.type.${type.toLowerCase()}`)}
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
                    label={t('crm.activities.status')}
                    fullWidth
                  >
                    {Object.values(ActivityStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {t(`crm.activities.status.${status.toLowerCase()}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="subject"
                control={control}
                rules={{ required: 'Subject is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.activities.subject')}
                    fullWidth
                    error={!!errors.subject}
                    helperText={errors.subject?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.activities.description')}
                    fullWidth
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="scheduledAt"
                control={control}
                rules={{ required: 'Scheduled date is required' }}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label={t('crm.activities.scheduledAt')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.scheduledAt,
                        helperText: errors.scheduledAt?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="completedAt"
                control={control}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    label={t('crm.activities.completedAt')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.completedAt,
                        helperText: errors.completedAt?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={t('crm.activities.priority')}
                    fullWidth
                  >
                    {Object.values(ActivityPriority).map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {t(`crm.activities.priority.${priority.toLowerCase()}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="duration"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.activities.duration')}
                    type="number"
                    fullWidth
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                    InputProps={{
                      endAdornment: t('crm.activities.minutes'),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.activities.location')}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="outcome"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.activities.outcome')}
                    fullWidth
                    multiline
                    rows={2}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('crm.activities.notes')}
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