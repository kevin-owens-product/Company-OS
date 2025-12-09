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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { employeeService, Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../../services/hr/employee.service';
import { departmentService } from '../../services/hr/department.service';
import { positionService } from '../../services/hr/position.service';
import { useTranslation } from 'react-i18next';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee;
  onSave: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  onClose,
  employee,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateEmployeeDto>({
    firstName: '',
    lastName: '',
    employeeId: '',
    dateOfBirth: new Date(),
    dateOfHire: new Date(),
    phone: '',
    address: '',
    emergencyContact: '',
    isActive: true,
    departmentId: '',
    positionId: '',
  });
  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
    loadDepartments();
    loadPositions();
  }, [employee]);

  const loadDepartments = async () => {
    try {
      const data = await departmentService.findAll();
      setDepartments(data);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadPositions = async () => {
    try {
      const data = await positionService.findAll();
      setPositions(data);
    } catch (error) {
      console.error('Error loading positions:', error);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: string) => (event: { target: { value: string } }) => {
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
      if (employee) {
        await employeeService.update(employee.id, formData);
      } else {
        await employeeService.create(formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {employee ? t('hr.employee.edit') : t('hr.employee.add')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.employee.firstName')}
              value={formData.firstName}
              onChange={handleChange('firstName')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.employee.lastName')}
              value={formData.lastName}
              onChange={handleChange('lastName')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.employee.employeeId')}
              value={formData.employeeId}
              onChange={handleChange('employeeId')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label={t('hr.employee.dateOfBirth')}
              value={formData.dateOfBirth}
              onChange={handleDateChange('dateOfBirth')}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label={t('hr.employee.hireDate')}
              value={formData.dateOfHire}
              onChange={handleDateChange('dateOfHire')}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.employee.phoneNumber')}
              value={formData.phone}
              onChange={handleChange('phone')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('hr.employee.address')}
              value={formData.address}
              onChange={handleChange('address')}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('hr.employee.emergencyContact')}
              value={formData.emergencyContact}
              onChange={handleChange('emergencyContact')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('hr.employee.department')}</InputLabel>
              <Select
                value={formData.departmentId}
                onChange={handleSelectChange('departmentId')}
                label={t('hr.employee.department')}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('hr.employee.position')}</InputLabel>
              <Select
                value={formData.positionId}
                onChange={handleSelectChange('positionId')}
                label={t('hr.employee.position')}
              >
                {positions.map((pos) => (
                  <MenuItem key={pos.id} value={pos.id}>
                    {pos.title}
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
              label={t('hr.employee.isActive')}
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