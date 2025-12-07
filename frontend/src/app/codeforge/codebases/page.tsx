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
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface Codebase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'ingesting' | 'analyzing' | 'ready' | 'error';
  repositoryCount: number;
  metadata: {
    totalFiles?: number;
    totalLines?: number;
    languages?: { [key: string]: number };
  };
  createdAt: string;
}

const statusColors: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'default',
  ingesting: 'warning',
  analyzing: 'info',
  ready: 'success',
  error: 'error',
};

export default function CodebasesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [codebases, setCodebases] = useState<Codebase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // TODO: Fetch codebases from API
    // Mock data for now
    setCodebases([
      {
        id: '1',
        name: 'Legacy ERP System',
        description: 'Main enterprise resource planning system',
        status: 'ready',
        repositoryCount: 12,
        metadata: {
          totalFiles: 2450,
          totalLines: 185000,
          languages: { Java: 60, JavaScript: 25, SQL: 15 },
        },
        createdAt: '2024-01-15',
      },
      {
        id: '2',
        name: 'Customer Portal',
        description: 'B2B customer self-service portal',
        status: 'analyzing',
        repositoryCount: 5,
        metadata: {
          totalFiles: 890,
          totalLines: 45000,
          languages: { TypeScript: 70, CSS: 20, HTML: 10 },
        },
        createdAt: '2024-02-20',
      },
    ]);
    setLoading(false);
  }, []);

  if (status === 'loading' || loading) {
    return <LinearProgress />;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Codebases
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your code repositories and trigger analyses
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/codeforge/codebases/new')}
        >
          Add Codebase
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Codebases
              </Typography>
              <Typography variant="h3">{codebases.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Repositories
              </Typography>
              <Typography variant="h3">
                {codebases.reduce((sum, cb) => sum + cb.repositoryCount, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Lines of Code
              </Typography>
              <Typography variant="h3">
                {(codebases.reduce((sum, cb) => sum + (cb.metadata.totalLines || 0), 0) / 1000).toFixed(0)}K
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Repositories</TableCell>
              <TableCell>Files</TableCell>
              <TableCell>Languages</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {codebases.map((codebase) => (
              <TableRow key={codebase.id} hover>
                <TableCell>
                  <Typography variant="subtitle2">{codebase.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {codebase.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={codebase.status}
                    size="small"
                    color={statusColors[codebase.status]}
                  />
                </TableCell>
                <TableCell>{codebase.repositoryCount}</TableCell>
                <TableCell>{codebase.metadata.totalFiles?.toLocaleString()}</TableCell>
                <TableCell>
                  {Object.entries(codebase.metadata.languages || {})
                    .slice(0, 3)
                    .map(([lang, pct]) => (
                      <Chip
                        key={lang}
                        label={`${lang} ${pct}%`}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                        variant="outlined"
                      />
                    ))}
                </TableCell>
                <TableCell>{new Date(codebase.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/codeforge/codebases/${codebase.id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton size="small">
                    <RefreshIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
