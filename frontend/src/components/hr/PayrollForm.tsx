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
import { payrollService, CreatePayrollDto } from '../../services/hr/payroll.service';
import { employeeService } from '../../services/hr/employee.service';
import { useTranslation } from 'react-i18next';

interface PayrollFormProps {
  open: boolean;
  onClose: () => void;
  payroll?: any;
  onSave: () => void;
}

export const PayrollForm: React.FC<PayrollFormProps> = ({
  open,
  onClose,
  payroll,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreatePayrollDto>({
    payPeriodStart: new Date(),
    payPeriodEnd: new Date(),
    baseSalary: 0,
    overtime: 0,
    bonuses: 0,
    deductions: 0,
    netSalary: 0,
    status: 'PENDING',
    details: {},
    taxInfo: {},
    benefits: {},
    employeeId: '',
  });
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (payroll) {
      setFormData({
        payPeriodStart: new Date(payroll.payPeriodStart),
        payPeriodEnd: new Date(payroll.payPeriodEnd),
        baseSalary: payroll.baseSalary || 0,
        overtime: payroll.overtime || 0,
        bonuses: payroll.bonuses || 0,
        deductions: payroll.deductions || 0,
        netSalary: payroll.netSalary || 0,
        status: payroll.status || 'PENDING',
        details: payroll.details || {},
        taxInfo: payroll.taxInfo || {},
        benefits: payroll.benefits || {},
        employeeId: payroll.employeeId || '',
      });
    }
    loadEmployees();
  }, [payroll]);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.findAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Calculate net salary when relevant fields change
    if (['baseSalary', 'overtime', 'bonuses', 'deductions'].includes(field)) {
      const baseSalary = field === 'baseSalary' ? parseFloat(value) : prev.baseSalary;
      const overtime = field === 'overtime' ? parseFloat(value) : prev.overtime;
      const bonuses = field === 'bonuses' ? parseFloat(value) : prev.bonuses;
      const deductions = field === 'deductions' ? parseFloat(value) : prev.deductions;

      setFormData((prev) => ({
        ...prev,
        netSalary: baseSalary + overtime + bonuses - deductions,
      }));
    }
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
      if (payroll) {
        await payrollService.update(payroll.id, formData);
      } else {
        await payrollService.create(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving payroll:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {payroll ? t('hr.payroll.edit') : t('hr.payroll.add')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('hr.payroll.employee')}</InputLabel>
              <Select
                value={formData.employeeId}
                onChange={handleSelectChange('employeeId')}
                label={t('hr.payroll.employee')}
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
            <FormControl fullWidth required>
              <InputLabel>{t('hr.payroll.status')}</InputLabel>
              <Select
                value={formData.status}
                onChange={handleSelectChange('status')}
                label={t('hr.payroll.status')}
              >
                <MenuItem value="PENDING">{t('hr.payroll.status.pending')}</MenuItem>
                <MenuItem value="PROCESSING">{t('hr.payroll.status.processing')}</MenuItem>
                <MenuItem value="COMPLETED">{t('hr.payroll.status.completed')}</MenuItem>
                <MenuItem value="FAILED">{t('hr.payroll.status.failed')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label={t('hr.payroll.periodStart')}
              value={formData.payPeriodStart}
              onChange={handleDateChange('payPeriodStart')}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label={t('hr.payroll.periodEnd')}
              value={formData.payPeriodEnd}
              onChange={handleDateChange('payPeriodEnd')}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.payroll.baseSalary')}
              type="number"
              value={formData.baseSalary}
              onChange={handleChange('baseSalary')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.payroll.overtime')}
              type="number"
              value={formData.overtime}
              onChange={handleChange('overtime')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.payroll.bonuses')}
              type="number"
              value={formData.bonuses}
              onChange={handleChange('bonuses')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.payroll.deductions')}
              type="number"
              value={formData.deductions}
              onChange={handleChange('deductions')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.payroll.netSalary')}
              type="number"
              value={formData.netSalary}
              disabled
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