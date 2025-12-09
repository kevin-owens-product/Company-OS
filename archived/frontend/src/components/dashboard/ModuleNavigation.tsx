import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  People as CrmIcon,
  Inventory as InventoryIcon,
  AccountBalance as AccountingIcon,
  Assignment as ProjectIcon,
  Email as CommunicationIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon, color, path }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
      }}
      onClick={() => navigate(path)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {React.cloneElement(icon as React.ReactElement, { sx: { color } })}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const ModuleNavigation: React.FC = () => {
  const { t } = useTranslation();

  const modules = [
    {
      title: t('modules.crm.title'),
      description: t('modules.crm.description'),
      icon: <CrmIcon />,
      color: '#1976d2',
      path: '/crm',
    },
    {
      title: t('modules.inventory.title'),
      description: t('modules.inventory.description'),
      icon: <InventoryIcon />,
      color: '#2e7d32',
      path: '/inventory',
    },
    {
      title: t('modules.accounting.title'),
      description: t('modules.accounting.description'),
      icon: <AccountingIcon />,
      color: '#ed6c02',
      path: '/accounting',
    },
    {
      title: t('modules.projects.title'),
      description: t('modules.projects.description'),
      icon: <ProjectIcon />,
      color: '#9c27b0',
      path: '/projects',
    },
    {
      title: t('modules.communication.title'),
      description: t('modules.communication.description'),
      icon: <CommunicationIcon />,
      color: '#0288d1',
      path: '/communication',
    },
    {
      title: t('modules.settings.title'),
      description: t('modules.settings.description'),
      icon: <SettingsIcon />,
      color: '#757575',
      path: '/settings',
    },
  ];

  return (
    <Grid container spacing={3}>
      {modules.map((module) => (
        <Grid item xs={12} sm={6} md={4} key={module.path}>
          <ModuleCard {...module} />
        </Grid>
      ))}
    </Grid>
  );
}; 