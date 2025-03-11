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
  LinearProgress,
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
import { OpportunityStage, OpportunityPriority } from '@/types/crm';

const mockOpportunities = [
  {
    id: '1',
    title: 'Enterprise Software License',
    value: 100000,
    probability: 0.7,
    stage: OpportunityStage.PROPOSAL,
    priority: OpportunityPriority.HIGH,
    expectedCloseDate: new Date('2024-06-30'),
    products: [
      { id: '1', name: 'Software License', quantity: 100, price: 1000 },
      { id: '2', name: 'Support Package', quantity: 1, price: 10000 },
    ],
  },
  {
    id: '2',
    title: 'Cloud Migration Project',
    value: 50000,
    probability: 0.5,
    stage: OpportunityStage.NEEDS_ANALYSIS,
    priority: OpportunityPriority.MEDIUM,
    expectedCloseDate: new Date('2024-05-15'),
    products: [
      { id: '3', name: 'Migration Service', quantity: 1, price: 40000 },
      { id: '4', name: 'Training', quantity: 1, price: 10000 },
    ],
  },
];

export default function OpportunityList() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getStageColor = (stage: OpportunityStage) => {
    switch (stage) {
      case OpportunityStage.CLOSED_WON:
        return 'success';
      case OpportunityStage.CLOSED_LOST:
        return 'error';
      case OpportunityStage.NEGOTIATION:
        return 'warning';
      case OpportunityStage.PROPOSAL:
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: OpportunityPriority) => {
    switch (priority) {
      case OpportunityPriority.HIGH:
        return 'error';
      case OpportunityPriority.MEDIUM:
        return 'warning';
      case OpportunityPriority.LOW:
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
          placeholder={t('crm.opportunities.search')}
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
          {t('crm.opportunities.add')}
        </Button>
      </Box>

      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('crm.opportunities.title')}</TableCell>
                <TableCell>{t('crm.opportunities.value')}</TableCell>
                <TableCell>{t('crm.opportunities.probability')}</TableCell>
                <TableCell>{t('crm.opportunities.stage')}</TableCell>
                <TableCell>{t('crm.opportunities.priority')}</TableCell>
                <TableCell>{t('crm.opportunities.expectedCloseDate')}</TableCell>
                <TableCell>{t('crm.opportunities.products')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockOpportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{opportunity.title}</Typography>
                  </TableCell>
                  <TableCell>
                    ${opportunity.value.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {(opportunity.probability * 100).toFixed(0)}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={opportunity.probability * 100}
                        sx={{ width: 60, height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`crm.opportunities.stage.${opportunity.stage.toLowerCase()}`)}
                      color={getStageColor(opportunity.stage)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`crm.opportunities.priority.${opportunity.priority.toLowerCase()}`)}
                      color={getPriorityColor(opportunity.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {opportunity.expectedCloseDate && format(opportunity.expectedCloseDate, DATE_FORMAT)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {opportunity.products.map((product) => (
                        <Typography key={product.id} variant="caption" color="text.secondary">
                          {product.name} (x{product.quantity})
                        </Typography>
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