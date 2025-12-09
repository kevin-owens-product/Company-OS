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
import { leaveService } from '../../services/hr/leave.service';
import { useTranslation } from 'react-i18next';
import { LeaveForm } from './LeaveForm';

export const LeaveList: React.FC = () => {
  const { t } = useTranslation();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  const loadLeaves = async () => {
    try {
      const data = await leaveService.findAll();
      setLeaves(data);
    } catch (error) {
      console.error('Error loading leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleAdd = () => {
    setSelectedLeave(null);
    setOpenForm(true);
  };

  const handleEdit = (leave: any) => {
    setSelectedLeave(leave);
    setOpenForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('common.confirmDelete'))) {
      try {
        await leaveService.delete(id);
        loadLeaves();
      } catch (error) {
        console.error('Error deleting leave:', error);
      }
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedLeave(null);
  };

  const handleFormSave = () => {
    loadLeaves();
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
        <Typography variant="h5">{t('hr.leave.title')}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          {t('hr.leave.add')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('hr.leave.employee')}</TableCell>
              <TableCell>{t('hr.leave.type')}</TableCell>
              <TableCell>{t('hr.leave.startDate')}</TableCell>
              <TableCell>{t('hr.leave.endDate')}</TableCell>
              <TableCell>{t('hr.leave.duration')}</TableCell>
              <TableCell>{t('hr.leave.status')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.employee?.firstName} {leave.employee?.lastName}</TableCell>
                <TableCell>{t(`hr.leave.type.${leave.type.toLowerCase()}`)}</TableCell>
                <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{leave.duration} {t('hr.leave.days')}</TableCell>
                <TableCell>
                  <Chip
                    label={t(`hr.leave.status.${leave.status.toLowerCase()}`)}
                    color={
                      leave.status === 'APPROVED'
                        ? 'success'
                        : leave.status === 'REJECTED'
                        ? 'error'
                        : 'warning'
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(leave)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(leave.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LeaveForm
        open={openForm}
        onClose={handleFormClose}
        leave={selectedLeave}
        onSave={handleFormSave}
      />
    </Box>
  );
}; 