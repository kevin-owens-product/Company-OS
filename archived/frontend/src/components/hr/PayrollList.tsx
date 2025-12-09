import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { payrollService } from '../../services/hr/payroll.service';
import { useTranslation } from 'react-i18next';
import { PayrollForm } from './PayrollForm';

export const PayrollList: React.FC = () => {
  const { t } = useTranslation();
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);

  const loadPayrolls = async () => {
    try {
      const data = await payrollService.findAll();
      setPayrolls(data);
    } catch (error) {
      console.error('Error loading payrolls:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrolls();
  }, []);

  const handleAdd = () => {
    setSelectedPayroll(null);
    setOpenForm(true);
  };

  const handleEdit = (payroll: any) => {
    setSelectedPayroll(payroll);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        await payrollService.delete(id);
        loadPayrolls();
      } catch (error) {
        console.error('Error deleting payroll:', error);
      }
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedPayroll(null);
  };

  const handleFormSave = () => {
    loadPayrolls();
    handleFormClose();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">{t('hr.payroll.title')}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          {t('hr.payroll.add')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('hr.payroll.employee')}</TableCell>
              <TableCell>{t('hr.payroll.period')}</TableCell>
              <TableCell>{t('hr.payroll.baseSalary')}</TableCell>
              <TableCell>{t('hr.payroll.overtime')}</TableCell>
              <TableCell>{t('hr.payroll.bonuses')}</TableCell>
              <TableCell>{t('hr.payroll.deductions')}</TableCell>
              <TableCell>{t('hr.payroll.netSalary')}</TableCell>
              <TableCell>{t('hr.payroll.status')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell>{payroll.employee?.firstName} {payroll.employee?.lastName}</TableCell>
                <TableCell>
                  {new Date(payroll.payPeriodStart).toLocaleDateString()} -{' '}
                  {new Date(payroll.payPeriodEnd).toLocaleDateString()}
                </TableCell>
                <TableCell>{payroll.baseSalary.toFixed(2)}</TableCell>
                <TableCell>{payroll.overtime.toFixed(2)}</TableCell>
                <TableCell>{payroll.bonuses.toFixed(2)}</TableCell>
                <TableCell>{payroll.deductions.toFixed(2)}</TableCell>
                <TableCell>{payroll.netSalary.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={t(`hr.payroll.status.${payroll.status.toLowerCase()}`)}
                    color={
                      payroll.status === 'COMPLETED'
                        ? 'success'
                        : payroll.status === 'FAILED'
                        ? 'error'
                        : 'warning'
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(payroll)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(payroll.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PayrollForm
        open={openForm}
        onClose={handleFormClose}
        payroll={selectedPayroll}
        onSave={handleFormSave}
      />
    </Box>
  );
}; 