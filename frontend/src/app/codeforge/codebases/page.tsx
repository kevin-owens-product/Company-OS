'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import { CodebaseService, CreateCodebaseDto } from '@/services/codeforge/codebase.service';
import { RepositoryService } from '@/services/codeforge/repository.service';
import { Codebase, CodebaseStatus, Repository } from '@/types/codeforge';

const statusColors: Record<CodebaseStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  [CodebaseStatus.PENDING]: 'default',
  [CodebaseStatus.INGESTING]: 'warning',
  [CodebaseStatus.ANALYZING]: 'info',
  [CodebaseStatus.READY]: 'success',
  [CodebaseStatus.ERROR]: 'error',
};

export default function CodebasesPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCodebase, setNewCodebase] = useState<CreateCodebaseDto>({ name: '', description: '' });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [authStatus, router]);

  // Fetch codebases
  const { data: codebases = [], isLoading, error, refetch } = useQuery({
    queryKey: ['codebases'],
    queryFn: CodebaseService.findAll,
    enabled: authStatus === 'authenticated',
  });

  // Fetch repositories count for each codebase
  const { data: repositoryCounts = {} } = useQuery({
    queryKey: ['repository-counts', codebases.map((c: Codebase) => c.id)],
    queryFn: async () => {
      const counts: Record<string, number> = {};
      for (const codebase of codebases) {
        try {
          const repos = await RepositoryService.findAll(codebase.id);
          counts[codebase.id] = repos.length;
        } catch {
          counts[codebase.id] = 0;
        }
      }
      return counts;
    },
    enabled: codebases.length > 0,
  });

  // Create codebase mutation
  const createMutation = useMutation({
    mutationFn: CodebaseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codebases'] });
      setCreateDialogOpen(false);
      setNewCodebase({ name: '', description: '' });
      setSnackbar({ open: true, message: 'Codebase created successfully', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: error.message || 'Failed to create codebase', severity: 'error' });
    },
  });

  // Delete codebase mutation
  const deleteMutation = useMutation({
    mutationFn: CodebaseService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codebases'] });
      setSnackbar({ open: true, message: 'Codebase deleted successfully', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: error.message || 'Failed to delete codebase', severity: 'error' });
    },
  });

  const handleCreate = () => {
    if (!newCodebase.name.trim()) return;
    createMutation.mutate(newCodebase);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (authStatus === 'loading') {
    return <LinearProgress />;
  }

  const totalRepos = Object.values(repositoryCounts).reduce((sum: number, count: number) => sum + count, 0);
  const totalLines = codebases.reduce((sum: number, cb: Codebase) => sum + (cb.metadata?.totalLines || 0), 0);

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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Add Codebase
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load codebases. Please try again.
        </Alert>
      )}

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
              <Typography variant="h3">{totalRepos}</Typography>
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
                {totalLines > 0 ? `${(totalLines / 1000).toFixed(0)}K` : '0'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : codebases.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No codebases yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create your first codebase to start analyzing code
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
            Add Codebase
          </Button>
        </Paper>
      ) : (
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
              {codebases.map((codebase: Codebase) => (
                <TableRow key={codebase.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{codebase.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {codebase.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={codebase.status}
                      size="small"
                      color={statusColors[codebase.status]}
                    />
                  </TableCell>
                  <TableCell>{repositoryCounts[codebase.id] || 0}</TableCell>
                  <TableCell>{codebase.metadata?.totalFiles?.toLocaleString() || '-'}</TableCell>
                  <TableCell>
                    {codebase.metadata?.languages ? (
                      Object.entries(codebase.metadata.languages)
                        .slice(0, 3)
                        .map(([lang, pct]) => (
                          <Chip
                            key={lang}
                            label={`${lang} ${pct}%`}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                            variant="outlined"
                          />
                        ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>{new Date(codebase.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/codeforge/codebases/${codebase.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Run Analysis">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => router.push(`/codeforge/analysis?codebaseId=${codebase.id}`)}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(codebase.id, codebase.name)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Codebase Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Codebase</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            required
            value={newCodebase.name}
            onChange={(e) => setNewCodebase({ ...newCodebase, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newCodebase.description}
            onChange={(e) => setNewCodebase({ ...newCodebase, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!newCodebase.name.trim() || createMutation.isPending}
          >
            {createMutation.isPending ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
