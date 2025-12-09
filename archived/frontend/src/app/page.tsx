'use client';

import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Container,
  useTheme,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  EventBusy as EventBusyIcon,
  AccountBalance as AccountBalanceIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();
  const theme = useTheme();

  const stats = [
    {
      title: 'dashboard.totalEmployees',
      value: '0',
      icon: <PeopleIcon sx={{ fontSize: 24, color: 'primary.main' }} />,
      trend: '+0%',
      color: theme.palette.primary.main,
    },
    {
      title: 'dashboard.totalDepartments',
      value: '0',
      icon: <BusinessIcon sx={{ fontSize: 24, color: 'secondary.main' }} />,
      trend: '+0%',
      color: theme.palette.secondary.main,
    },
    {
      title: 'dashboard.pendingLeaves',
      value: '0',
      icon: <EventBusyIcon sx={{ fontSize: 24, color: 'warning.main' }} />,
      trend: '0',
      color: theme.palette.warning.main,
    },
    {
      title: 'dashboard.pendingPayrolls',
      value: '0',
      icon: <AccountBalanceIcon sx={{ fontSize: 24, color: 'success.main' }} />,
      trend: '0',
      color: theme.palette.success.main,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 4,
          }}
        >
          {t('dashboard.title')}
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'hidden',
                  border: 1,
                  borderColor: 'divider',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${stat.color}10` }}>
                    {stat.icon}
                  </Box>
                  <Tooltip title="More options">
                    <IconButton size="small">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600 }}>
                  {stat.value}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 1.5 }}
                >
                  {t(stat.title)}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon
                    sx={{ fontSize: 16, color: 'success.main' }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: 'success.main', fontWeight: 500 }}
                  >
                    {stat.trend}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary' }}
                  >
                    vs last month
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={70}
                  sx={{
                    mt: 2,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: `${stat.color}20`,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: stat.color,
                    },
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
} 