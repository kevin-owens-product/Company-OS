import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import { EmployeeList } from '../components/hr/EmployeeList';
import { DepartmentList } from '../components/hr/DepartmentList';
import { PositionList } from '../components/hr/PositionList';
import { LeaveList } from '../components/hr/LeaveList';
import { PayrollList } from '../components/hr/PayrollList';
import { useTranslation } from 'react-i18next';

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
      id={`hr-tabpanel-${index}`}
      aria-labelledby={`hr-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const HRModule: React.FC = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%', mt: 3 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ p: 2 }}>
            {t('hr.title')}
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="hr module tabs"
            >
              <Tab label={t('hr.employee.title')} />
              <Tab label={t('hr.department.title')} />
              <Tab label={t('hr.position.title')} />
              <Tab label={t('hr.leave.title')} />
              <Tab label={t('hr.payroll.title')} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <EmployeeList />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DepartmentList />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <PositionList />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <LeaveList />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <PayrollList />
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}; 