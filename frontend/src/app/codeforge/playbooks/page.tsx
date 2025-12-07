'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Tabs,
  Tab,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CodeIcon from '@mui/icons-material/Code';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BuildIcon from '@mui/icons-material/Build';

interface Playbook {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  status: 'draft' | 'active' | 'deprecated';
  isBuiltIn: boolean;
  config: {
    targetLanguages?: string[];
    estimatedEffort?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };
  metrics?: {
    timesExecuted?: number;
    successRate?: number;
  };
}

const categoryInfo: Record<string, { icon: JSX.Element; color: string; label: string }> = {
  consolidation: { icon: <BuildIcon />, color: '#2196f3', label: 'PB-100: Consolidation' },
  security: { icon: <SecurityIcon />, color: '#f44336', label: 'PB-200: Security' },
  cost_optimization: { icon: <SpeedIcon />, color: '#4caf50', label: 'PB-300: Cost Optimization' },
  developer_experience: { icon: <CodeIcon />, color: '#ff9800', label: 'PB-400: Developer Experience' },
  compliance: { icon: <VerifiedUserIcon />, color: '#9c27b0', label: 'PB-500: Compliance' },
};

export default function PlaybooksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // TODO: Fetch playbooks from API
    setPlaybooks([
      {
        id: '1',
        code: 'PB-201',
        name: 'Dependency Audit',
        description: 'Identify and upgrade vulnerable dependencies across all repositories',
        category: 'security',
        status: 'active',
        isBuiltIn: true,
        config: {
          targetLanguages: ['JavaScript', 'TypeScript', 'Python', 'Java'],
          estimatedEffort: '1-2 days',
          riskLevel: 'low',
        },
        metrics: { timesExecuted: 45, successRate: 98 },
      },
      {
        id: '2',
        code: 'PB-301',
        name: 'Dead Code Removal',
        description: 'Identify and safely remove unused code to reduce maintenance burden',
        category: 'cost_optimization',
        status: 'active',
        isBuiltIn: true,
        config: {
          targetLanguages: ['JavaScript', 'TypeScript', 'Python'],
          estimatedEffort: '2-5 days',
          riskLevel: 'medium',
        },
        metrics: { timesExecuted: 23, successRate: 95 },
      },
      {
        id: '3',
        code: 'PB-101',
        name: 'Frontend Consolidation',
        description: 'Standardize frontend frameworks to React from Angular/Vue/jQuery',
        category: 'consolidation',
        status: 'active',
        isBuiltIn: true,
        config: {
          targetLanguages: ['JavaScript', 'TypeScript'],
          estimatedEffort: '2-4 weeks',
          riskLevel: 'high',
        },
        metrics: { timesExecuted: 8, successRate: 88 },
      },
      {
        id: '4',
        code: 'PB-401',
        name: 'Monorepo Migration',
        description: 'Consolidate repositories with proper tooling (Nx, Turborepo)',
        category: 'developer_experience',
        status: 'active',
        isBuiltIn: true,
        config: {
          targetLanguages: ['JavaScript', 'TypeScript'],
          estimatedEffort: '1-2 weeks',
          riskLevel: 'medium',
        },
        metrics: { timesExecuted: 12, successRate: 92 },
      },
      {
        id: '5',
        code: 'PB-501',
        name: 'SOC2 Readiness',
        description: 'Implement logging, access controls, and audit trails for SOC2 compliance',
        category: 'compliance',
        status: 'active',
        isBuiltIn: true,
        config: {
          targetLanguages: ['All'],
          estimatedEffort: '2-4 weeks',
          riskLevel: 'low',
        },
        metrics: { timesExecuted: 15, successRate: 100 },
      },
    ]);
    setLoading(false);
  }, []);

  const filteredPlaybooks = selectedCategory === 'all'
    ? playbooks
    : playbooks.filter((pb) => pb.category === selectedCategory);

  if (status === 'loading' || loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Playbooks
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Pre-built transformation patterns and automation rules
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/codeforge/playbooks/new')}
        >
          Create Playbook
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Playbooks" value="all" />
          {Object.entries(categoryInfo).map(([key, info]) => (
            <Tab
              key={key}
              label={info.label}
              value={key}
              icon={info.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {filteredPlaybooks.map((playbook) => (
          <Grid item xs={12} sm={6} md={4} key={playbook.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `4px solid ${categoryInfo[playbook.category]?.color || '#ccc'}`,
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip
                    label={playbook.code}
                    size="small"
                    sx={{
                      bgcolor: categoryInfo[playbook.category]?.color,
                      color: 'white',
                    }}
                  />
                  {playbook.isBuiltIn && (
                    <Chip label="Built-in" size="small" variant="outlined" />
                  )}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {playbook.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {playbook.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    label={`Effort: ${playbook.config.estimatedEffort}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`Risk: ${playbook.config.riskLevel}`}
                    size="small"
                    variant="outlined"
                    color={
                      playbook.config.riskLevel === 'high'
                        ? 'error'
                        : playbook.config.riskLevel === 'medium'
                        ? 'warning'
                        : 'success'
                    }
                  />
                </Box>
                {playbook.metrics && (
                  <Typography variant="caption" color="text.secondary">
                    Executed {playbook.metrics.timesExecuted} times •{' '}
                    {playbook.metrics.successRate}% success rate
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => router.push(`/codeforge/playbooks/${playbook.id}`)}>
                  View Details
                </Button>
                <Button size="small" color="primary">
                  Run
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
