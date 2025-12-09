'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CodeIcon from '@mui/icons-material/Code';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BuildIcon from '@mui/icons-material/Build';
import { PlaybookService } from '@/services/codeforge/playbook.service';
import { Playbook, PlaybookCategory, PlaybookStatus } from '@/types/codeforge';

const categoryInfo: Record<PlaybookCategory, { icon: JSX.Element; color: string; label: string }> = {
  [PlaybookCategory.CONSOLIDATION]: { icon: <BuildIcon />, color: '#2196f3', label: 'PB-100: Consolidation' },
  [PlaybookCategory.SECURITY]: { icon: <SecurityIcon />, color: '#f44336', label: 'PB-200: Security' },
  [PlaybookCategory.COST_OPTIMIZATION]: { icon: <SpeedIcon />, color: '#4caf50', label: 'PB-300: Cost Optimization' },
  [PlaybookCategory.DEVELOPER_EXPERIENCE]: { icon: <CodeIcon />, color: '#ff9800', label: 'PB-400: Developer Experience' },
  [PlaybookCategory.COMPLIANCE]: { icon: <VerifiedUserIcon />, color: '#9c27b0', label: 'PB-500: Compliance' },
  [PlaybookCategory.CUSTOM]: { icon: <BuildIcon />, color: '#607d8b', label: 'Custom' },
};

export default function PlaybooksPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [authStatus, router]);

  // Fetch playbooks
  const { data: playbooks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['playbooks', selectedCategory],
    queryFn: () => selectedCategory === 'all'
      ? PlaybookService.findAll()
      : PlaybookService.findAll(selectedCategory as PlaybookCategory),
    enabled: authStatus === 'authenticated',
  });

  const filteredPlaybooks = selectedCategory === 'all'
    ? playbooks
    : playbooks.filter((pb: Playbook) => pb.category === selectedCategory);

  if (authStatus === 'loading') {
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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load playbooks. Please try again.
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, value) => setSelectedCategory(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Playbooks" value="all" />
          {Object.entries(categoryInfo).filter(([key]) => key !== PlaybookCategory.CUSTOM).map(([key, info]) => (
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

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredPlaybooks.length === 0 ? (
        <Alert severity="info">
          No playbooks found in this category. Create a custom playbook or seed the built-in playbooks.
          <Button size="small" onClick={() => PlaybookService.seedBuiltIn().then(() => refetch())} sx={{ ml: 2 }}>
            Seed Built-in Playbooks
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredPlaybooks.map((playbook: Playbook) => (
            <Grid item xs={12} sm={6} md={4} key={playbook.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `4px solid ${categoryInfo[playbook.category]?.color || '#ccc'}`,
                  opacity: playbook.status === PlaybookStatus.DEPRECATED ? 0.6 : 1,
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
                    <Box>
                      {playbook.isBuiltIn && (
                        <Chip label="Built-in" size="small" variant="outlined" sx={{ mr: 0.5 }} />
                      )}
                      {playbook.status === PlaybookStatus.DEPRECATED && (
                        <Chip label="Deprecated" size="small" color="warning" />
                      )}
                    </Box>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {playbook.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {playbook.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {playbook.config?.estimatedEffort && (
                      <Chip
                        label={`Effort: ${playbook.config.estimatedEffort}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {playbook.config?.riskLevel && (
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
                    )}
                  </Box>
                  {playbook.config?.targetLanguages && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Languages: {playbook.config.targetLanguages.slice(0, 4).join(', ')}
                        {playbook.config.targetLanguages.length > 4 && '...'}
                      </Typography>
                    </Box>
                  )}
                  {playbook.metrics && (
                    <Typography variant="caption" color="text.secondary">
                      Executed {playbook.metrics.timesExecuted || 0} times
                      {playbook.metrics.successRate !== undefined && (
                        <> • {playbook.metrics.successRate.toFixed(0)}% success rate</>
                      )}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => router.push(`/codeforge/playbooks/${playbook.id}`)}>
                    View Details
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    disabled={playbook.status !== PlaybookStatus.ACTIVE}
                    onClick={() => router.push(`/codeforge/transformations/new?playbook=${playbook.code}`)}
                  >
                    Run
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
