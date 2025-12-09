import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { CustomerType, CustomerStatus } from '@/types/crm';

const mockCustomers = [
  {
    id: '1',
    name: 'Acme Corporation',
    type: CustomerType.COMPANY,
    status: CustomerStatus.CUSTOMER,
    email: 'contact@acme.com',
    phone: '+1 234 567 890',
    lifetimeValue: 50000,
    tags: ['Enterprise', 'Manufacturing'],
  },
  {
    id: '2',
    name: 'John Smith',
    type: CustomerType.INDIVIDUAL,
    status: CustomerStatus.LEAD,
    email: 'john.smith@email.com',
    phone: '+1 234 567 891',
    lifetimeValue: 0,
    tags: ['Prospect', 'High Priority'],
  },
];

export default function CustomerList() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getStatusColor = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.CUSTOMER:
        return 'success';
      case CustomerStatus.LEAD:
        return 'warning';
      case CustomerStatus.PROSPECT:
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder={t('crm.customers.search')}
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ width: 300 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 100 }}
        >
          {t('crm.customers.add')}
        </Button>
      </Box>

      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('crm.customers.name')}</TableCell>
                <TableCell>{t('crm.customers.type')}</TableCell>
                <TableCell>{t('crm.customers.status')}</TableCell>
                <TableCell>{t('crm.customers.email')}</TableCell>
                <TableCell>{t('crm.customers.phone')}</TableCell>
                <TableCell>{t('crm.customers.lifetimeValue')}</TableCell>
                <TableCell>{t('crm.customers.tags')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{customer.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`crm.customers.type.${customer.type.toLowerCase()}`)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`crm.customers.status.${customer.status.toLowerCase()}`)}
                      size="small"
                      color={getStatusColor(customer.status)}
                    />
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    ${customer.lifetimeValue.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {customer.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.edit')}>
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
} 