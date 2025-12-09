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
import { format } from 'date-fns';
import { DATE_FORMAT } from '@/config';

const mockContacts = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    title: 'CEO',
    department: 'Executive',
    email: 'john.smith@acme.com',
    phone: '+1 234 567 890',
    mobile: '+1 234 567 891',
    isPrimary: true,
    lastContactDate: new Date('2024-03-15'),
    tags: ['Executive', 'Decision Maker'],
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    title: 'Sales Manager',
    department: 'Sales',
    email: 'jane.doe@acme.com',
    phone: '+1 234 567 892',
    mobile: '+1 234 567 893',
    isPrimary: false,
    lastContactDate: new Date('2024-03-10'),
    tags: ['Sales', 'Manager'],
  },
];

export default function ContactList() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder={t('crm.contacts.search')}
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
          {t('crm.contacts.add')}
        </Button>
      </Box>

      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('crm.contacts.name')}</TableCell>
                <TableCell>{t('crm.contacts.title')}</TableCell>
                <TableCell>{t('crm.contacts.department')}</TableCell>
                <TableCell>{t('crm.contacts.email')}</TableCell>
                <TableCell>{t('crm.contacts.phone')}</TableCell>
                <TableCell>{t('crm.contacts.isPrimary')}</TableCell>
                <TableCell>{t('crm.contacts.lastContactDate')}</TableCell>
                <TableCell>{t('crm.contacts.tags')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {`${contact.firstName} ${contact.lastName}`}
                    </Typography>
                  </TableCell>
                  <TableCell>{contact.title}</TableCell>
                  <TableCell>{contact.department}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={contact.isPrimary ? t('common.yes') : t('common.no')}
                      color={contact.isPrimary ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {contact.lastContactDate && format(contact.lastContactDate, DATE_FORMAT)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {contact.tags.map((tag) => (
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