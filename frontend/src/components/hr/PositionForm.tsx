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
import { positionService, CreatePositionDto } from '../../services/hr/position.service';
import { departmentService } from '../../services/hr/department.service';
import { useTranslation } from 'react-i18next';

interface PositionFormProps {
  open: boolean;
  onClose: () => void;
  position?: any;
  onSave: () => void;
}

export const PositionForm: React.FC<PositionFormProps> = ({
  open,
  onClose,
  position,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreatePositionDto>({
    title: '',
    description: '',
    baseSalary: 0,
    requirements: {},
    responsibilities: {},
    isActive: true,
    tenantId: '',
    departmentId: '',
  });
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    if (position) {
      setFormData({
        title: position.title || '',
        description: position.description || '',
        baseSalary: position.baseSalary || 0,
        requirements: position.requirements || {},
        responsibilities: position.responsibilities || {},
        isActive: position.isActive ?? true,
        tenantId: position.tenantId || '',
        departmentId: position.departmentId || '',
      });
    }
    loadDepartments();
  }, [position]);

  const loadDepartments = async () => {
    try {
      const data = await departmentService.findAll();
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

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
      if (position) {
        await positionService.update(position.id, formData);
      } else {
        await positionService.create(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving position:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {position ? t('hr.position.edit') : t('hr.position.add')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('hr.position.title')}
              value={formData.title}
              onChange={handleChange('title')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('hr.position.description')}
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.position.baseSalary')}
              type="number"
              value={formData.baseSalary}
              onChange={handleChange('baseSalary')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('hr.position.department')}</InputLabel>
              <Select
                value={formData.departmentId}
                onChange={handleSelectChange('departmentId')}
                label={t('hr.position.department')}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
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
              label={t('hr.position.isActive')}
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