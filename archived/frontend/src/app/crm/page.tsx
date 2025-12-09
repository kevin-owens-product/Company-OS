'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  useTheme,
} from '@mui/material';
import {
  People as CustomersIcon,
  ContactMail as ContactsIcon,
  MonetizationOn as OpportunitiesIcon,
  EventNote as ActivitiesIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import CustomerList from '@/components/crm/CustomerList';
import ContactList from '@/components/crm/ContactList';
import OpportunityList from '@/components/crm/OpportunityList';
import ActivityList from '@/components/crm/ActivityList';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`crm-tabpanel-${index}`}
      aria-labelledby={`crm-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CrmPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
          {t('crm.title')}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="CRM tabs"
            sx={{
              px: 2,
              pt: 2,
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontSize: '0.875rem',
              },
            }}
          >
            <Tab
              icon={<CustomersIcon />}
              label={t('crm.customers')}
              iconPosition="start"
            />
            <Tab
              icon={<ContactsIcon />}
              label={t('crm.contacts')}
              iconPosition="start"
            />
            <Tab
              icon={<OpportunitiesIcon />}
              label={t('crm.opportunities')}
              iconPosition="start"
            />
            <Tab
              icon={<ActivitiesIcon />}
              label={t('crm.activities')}
              iconPosition="start"
            />
          </Tabs>

          <TabPanel value={value} index={0}>
            <CustomerList />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ContactList />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <OpportunityList />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <ActivityList />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
} 