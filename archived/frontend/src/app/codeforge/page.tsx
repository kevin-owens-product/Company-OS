'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface DashboardStats {
  totalCodebases: number;
  activeAnalyses: number;
  openFindings: number;
  completedTransformations: number;
}

export default function CodeForgePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalCodebases: 0,
    activeAnalyses: 0,
    openFindings: 0,
    completedTransformations: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <LinearProgress />;
  }

  const features = [
    {
      title: 'Codebases',
      description: 'Manage and analyze your code repositories',
      icon: <CodeIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
      href: '/codeforge/codebases',
      stat: `${stats.totalCodebases} repositories`,
    },
    {
      title: 'Analysis',
      description: 'Deep code analysis with AI-powered insights',
      icon: <AssessmentIcon sx={{ fontSize: 48, color: 'success.main' }} />,
      href: '/codeforge/analysis',
      stat: `${stats.activeAnalyses} active`,
    },
    {
      title: 'Playbooks',
      description: 'Transformation rules and automation patterns',
      icon: <SpeedIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
      href: '/codeforge/playbooks',
      stat: '5 categories',
    },
    {
      title: 'Transformations',
      description: 'Execute and monitor code transformations',
      icon: <SecurityIcon sx={{ fontSize: 48, color: 'error.main' }} />,
      href: '/codeforge/transformations',
      stat: `${stats.completedTransformations} completed`,
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          CodeForge
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          AI-Powered Legacy Code Transformation Platform
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Chip label="Due Diligence" color="primary" variant="outlined" />
          <Chip label="Modernization" color="success" variant="outlined" />
          <Chip label="Security" color="error" variant="outlined" />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ mt: 2, display: 'block' }}
                >
                  {feature.stat}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => router.push(feature.href)}
                >
                  Open
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/codeforge/codebases/new')}
            >
              Add Codebase
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push('/codeforge/analysis/new')}
            >
              Run Analysis
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => router.push('/codeforge/playbooks')}
            >
              Browse Playbooks
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
