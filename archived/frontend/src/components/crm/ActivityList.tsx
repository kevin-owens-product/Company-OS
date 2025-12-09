import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
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
  Event as EventIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  VideoCall as VideoCallIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { DATE_TIME_FORMAT } from '@/config';
import { ActivityType, ActivityStatus, ActivityPriority } from '@/types/crm';

const mockActivities = [
  {
    id: '1',
    type: ActivityType.MEETING,
    subject: 'Product Demo',
    description: 'Virtual product demonstration for Enterprise Software License opportunity',
    scheduledAt: new Date('2024-04-15T14:00:00'),
    status: ActivityStatus.PLANNED,
    priority: ActivityPriority.HIGH,
    duration: 60,
    location: 'Google Meet',
    customerId: '1',
    customerName: 'Acme Corp',
    contactId: '1',
    contactName: 'John Doe',
    opportunityId: '1',
    opportunityTitle: 'Enterprise Software License',
  },
  {
    id: '2',
    type: ActivityType.CALL,
    subject: 'Follow-up Call',
    description: 'Follow up on migration project requirements',
    scheduledAt: new Date('2024-04-16T10:30:00'),
    status: ActivityStatus.COMPLETED,
    priority: ActivityPriority.MEDIUM,
    duration: 30,
    customerId: '2',
    customerName: 'TechCorp',
    contactId: '2',
    contactName: 'Jane Smith',
    opportunityId: '2',
    opportunityTitle: 'Cloud Migration Project',
  },
];

export default function ActivityList() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.MEETING:
        return <EventIcon fontSize="small" />;
      case ActivityType.CALL:
        return <PhoneIcon fontSize="small" />;
      case ActivityType.EMAIL:
        return <EmailIcon fontSize="small" />;
      case ActivityType.VIDEO_CALL:
        return <VideoCallIcon fontSize="small" />;
      case ActivityType.TASK:
        return <TaskIcon fontSize="small" />;
      default:
        return <TaskIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case ActivityStatus.COMPLETED:
        return 'success';
      case ActivityStatus.IN_PROGRESS:
        return 'warning';
      case ActivityStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: ActivityPriority) => {
    switch (priority) {
      case ActivityPriority.HIGH:
        return 'error';
      case ActivityPriority.MEDIUM:
        return 'warning';
      case ActivityPriority.LOW:
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
          placeholder={t('crm.activities.search')}
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
          {t('crm.activities.add')}
        </Button>
      </Box>

      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('crm.activities.type')}</TableCell>
                <TableCell>{t('crm.activities.subject')}</TableCell>
                <TableCell>{t('crm.activities.scheduledAt')}</TableCell>
                <TableCell>{t('crm.activities.status')}</TableCell>
                <TableCell>{t('crm.activities.priority')}</TableCell>
                <TableCell>{t('crm.activities.duration')}</TableCell>
                <TableCell>{t('crm.activities.customer')}</TableCell>
                <TableCell>{t('crm.activities.contact')}</TableCell>
                <TableCell>{t('crm.activities.opportunity')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getActivityIcon(activity.type)}
                      <Typography variant="body2">
                        {t(`crm.activities.type.${activity.type.toLowerCase()}`)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{activity.subject}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {format(activity.scheduledAt, DATE_TIME_FORMAT)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`crm.activities.status.${activity.status.toLowerCase()}`)}
                      color={getStatusColor(activity.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`crm.activities.priority.${activity.priority.toLowerCase()}`)}
                      color={getPriorityColor(activity.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {activity.duration} {t('crm.activities.minutes')}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{activity.customerName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{activity.contactName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{activity.opportunityTitle}</Typography>
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