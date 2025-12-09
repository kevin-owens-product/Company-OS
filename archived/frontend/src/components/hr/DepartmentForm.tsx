import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
} from '@mui/material';
import { departmentService, CreateDepartmentDto, UpdateDepartmentDto } from '../../services/hr/department.service';
import { useTranslation } from 'react-i18next';

interface DepartmentFormProps {
  open: boolean;
  onClose: () => void;
  department?: any;
  onSave: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  open,
  onClose,
  department,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateDepartmentDto>({
    name: '',
    description: '',
    managerId: '',
    isActive: true,
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || '',
        managerId: department.managerId || '',
        isActive: department.isActive ?? true,
      });
    }
  }, [department]);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (department) {
        await departmentService.update(department.id, formData);
      } else {
        await departmentService.create(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {department ? t('hr.department.edit') : t('hr.department.add')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('hr.department.name')}
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('hr.department.description')}
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>{t('hr.department.manager')}</InputLabel>
              <Select
                value={formData.managerId}
                onChange={handleSelectChange('managerId')}
                label={t('hr.department.manager')}
              >
                {/* TODO: Add manager options */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                />
              }
              label={t('hr.department.isActive')}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 