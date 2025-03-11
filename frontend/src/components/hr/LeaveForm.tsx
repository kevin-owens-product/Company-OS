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
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { leaveService, CreateLeaveDto } from '../../services/hr/leave.service';
import { employeeService } from '../../services/hr/employee.service';
import { useTranslation } from 'react-i18next';

interface LeaveFormProps {
  open: boolean;
  onClose: () => void;
  leave?: any;
  onSave: () => void;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({
  open,
  onClose,
  leave,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateLeaveDto>({
    type: '',
    startDate: new Date(),
    endDate: new Date(),
    duration: 0,
    reason: '',
    attachments: [],
    employeeId: '',
    tenantId: '',
  });
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (leave) {
      setFormData({
        type: leave.type || '',
        startDate: new Date(leave.startDate),
        endDate: new Date(leave.endDate),
        duration: leave.duration || 0,
        reason: leave.reason || '',
        attachments: leave.attachments || [],
        employeeId: leave.employeeId || '',
        tenantId: leave.tenantId || '',
      });
    }
    loadEmployees();
  }, [leave]);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.findAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
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

  const handleDateChange = (field: string) => (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (leave) {
        await leaveService.update(leave.id, formData);
      } else {
        await leaveService.create(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving leave:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {leave ? t('hr.leave.edit') : t('hr.leave.add')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('hr.leave.type')}</InputLabel>
              <Select
                value={formData.type}
                onChange={handleSelectChange('type')}
                label={t('hr.leave.type')}
              >
                <MenuItem value="ANNUAL">{t('hr.leave.type.annual')}</MenuItem>
                <MenuItem value="SICK">{t('hr.leave.type.sick')}</MenuItem>
                <MenuItem value="MATERNITY">{t('hr.leave.type.maternity')}</MenuItem>
                <MenuItem value="PATERNITY">{t('hr.leave.type.paternity')}</MenuItem>
                <MenuItem value="UNPAID">{t('hr.leave.type.unpaid')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('hr.leave.employee')}</InputLabel>
              <Select
                value={formData.employeeId}
                onChange={handleSelectChange('employeeId')}
                label={t('hr.leave.employee')}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label={t('hr.leave.startDate')}
              value={formData.startDate}
              onChange={handleDateChange('startDate')}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label={t('hr.leave.endDate')}
              value={formData.endDate}
              onChange={handleDateChange('endDate')}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.leave.duration')}
              type="number"
              value={formData.duration}
              onChange={handleChange('duration')}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('hr.leave.reason')}
              value={formData.reason}
              onChange={handleChange('reason')}
              multiline
              rows={3}
              required
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