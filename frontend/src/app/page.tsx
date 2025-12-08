'use client';

import React, { useEffect, useState } from 'react';
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
  Skeleton,
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
import { API_URL } from '../config';

interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  pendingLeaves: number;
  pendingPayrolls: number;
}

export default function HomePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
    pendingPayrolls: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [employeesRes, departmentsRes, leavesRes, payrollsRes] = await Promise.allSettled([
          fetch(`${API_URL}/hr/employees`),
          fetch(`${API_URL}/hr/departments`),
          fetch(`${API_URL}/hr/leaves`),
          fetch(`${API_URL}/hr/payrolls`),
        ]);

        let totalEmployees = 0;
        let totalDepartments = 0;
        let pendingLeaves = 0;
        let pendingPayrolls = 0;

        if (employeesRes.status === 'fulfilled' && employeesRes.value.ok) {
          const employees = await employeesRes.value.json();
          totalEmployees = Array.isArray(employees) ? employees.length : 0;
        }

        if (departmentsRes.status === 'fulfilled' && departmentsRes.value.ok) {
          const departments = await departmentsRes.value.json();
          totalDepartments = Array.isArray(departments) ? departments.length : 0;
        }

        if (leavesRes.status === 'fulfilled' && leavesRes.value.ok) {
          const leaves = await leavesRes.value.json();
          if (Array.isArray(leaves)) {
            pendingLeaves = leaves.filter((l: { status: string }) => l.status === 'pending').length;
          }
        }

        if (payrollsRes.status === 'fulfilled' && payrollsRes.value.ok) {
          const payrolls = await payrollsRes.value.json();
          if (Array.isArray(payrolls)) {
            pendingPayrolls = payrolls.filter((p: { status: string }) => p.status === 'pending').length;
          }
        }

        setStats({
          totalEmployees,
          totalDepartments,
          pendingLeaves,
          pendingPayrolls,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'dashboard.totalEmployees',
      value: stats.totalEmployees.toString(),
      icon: <PeopleIcon sx={{ fontSize: 24, color: 'primary.main' }} />,
      trend: '+12%',
      color: theme.palette.primary.main,
    },
    {
      title: 'dashboard.totalDepartments',
      value: stats.totalDepartments.toString(),
      icon: <BusinessIcon sx={{ fontSize: 24, color: 'secondary.main' }} />,
      trend: '+5%',
      color: theme.palette.secondary.main,
    },
    {
      title: 'dashboard.pendingLeaves',
      value: stats.pendingLeaves.toString(),
      icon: <EventBusyIcon sx={{ fontSize: 24, color: 'warning.main' }} />,
      trend: stats.pendingLeaves > 0 ? `${stats.pendingLeaves} pending` : 'All clear',
      color: theme.palette.warning.main,
    },
    {
      title: 'dashboard.pendingPayrolls',
      value: stats.pendingPayrolls.toString(),
      icon: <AccountBalanceIcon sx={{ fontSize: 24, color: 'success.main' }} />,
      trend: stats.pendingPayrolls > 0 ? `${stats.pendingPayrolls} to process` : 'All processed',
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
          {statCards.map((stat, index) => (
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

                {loading ? (
                  <Skeleton variant="text" width={60} height={48} />
                ) : (
                  <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                )}

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
                  value={loading ? 0 : 70}
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
