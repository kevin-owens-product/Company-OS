'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Snackbar,
  Tabs,
  Tab,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GitHubIcon from '@mui/icons-material/GitHub';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import SpeedIcon from '@mui/icons-material/Speed';
import FolderIcon from '@mui/icons-material/Folder';
import { CodebaseService } from '@/services/codeforge/codebase.service';
import { RepositoryService, CreateRepositoryDto } from '@/services/codeforge/repository.service';
import {
  Codebase,
  CodebaseStatus,
  Repository,
  RepositoryProvider,
  RepositoryStatus,
  Analysis,
  AnalysisStatus
} from '@/types/codeforge';

const statusColors: Record<CodebaseStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  [CodebaseStatus.PENDING]: 'default',
  [CodebaseStatus.INGESTING]: 'warning',
  [CodebaseStatus.ANALYZING]: 'info',
  [CodebaseStatus.READY]: 'success',
  [CodebaseStatus.ERROR]: 'error',
};

const repoStatusColors: Record<RepositoryStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  [RepositoryStatus.PENDING]: 'default',
  [RepositoryStatus.CLONING]: 'warning',
  [RepositoryStatus.READY]: 'success',
  [RepositoryStatus.STALE]: 'warning',
  [RepositoryStatus.ERROR]: 'error',
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CodebaseDetailPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const codebaseId = params.id as string;
  const queryClient = useQueryClient();

  const [tabValue, setTabValue] = useState(0);
  const [addRepoOpen, setAddRepoOpen] = useState(false);
  const [newRepo, setNewRepo] = useState<CreateRepositoryDto>({
    name: '',
    url: '',
    provider: RepositoryProvider.GITHUB,
    branch: 'main',
  });
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

  // Fetch codebase
  const { data: codebase, isLoading: codebaseLoading, error: codebaseError } = useQuery({
    queryKey: ['codebase', codebaseId],
    queryFn: () => CodebaseService.findOne(codebaseId),
    enabled: authStatus === 'authenticated' && !!codebaseId,
  });

  // Fetch repositories
  const { data: repositories = [], isLoading: reposLoading, refetch: refetchRepos } = useQuery({
    queryKey: ['repositories', codebaseId],
    queryFn: () => RepositoryService.findAll(codebaseId),
    enabled: authStatus === 'authenticated' && !!codebaseId,
  });

  // Fetch analyses
  const { data: analyses = [], isLoading: analysesLoading } = useQuery({
    queryKey: ['analyses', codebaseId],
    queryFn: () => CodebaseService.getAnalyses(codebaseId),
    enabled: authStatus === 'authenticated' && !!codebaseId,
  });

  // Add repository mutation
  const addRepoMutation = useMutation({
    mutationFn: (data: CreateRepositoryDto) => RepositoryService.create(codebaseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories', codebaseId] });
      setAddRepoOpen(false);
      setNewRepo({ name: '', url: '', provider: RepositoryProvider.GITHUB, branch: 'main' });
      setSnackbar({ open: true, message: 'Repository added successfully', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: error.message || 'Failed to add repository', severity: 'error' });
    },
  });

  // Delete repository mutation
  const deleteRepoMutation = useMutation({
    mutationFn: (repoId: string) => RepositoryService.remove(codebaseId, repoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories', codebaseId] });
      setSnackbar({ open: true, message: 'Repository removed successfully', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: error.message || 'Failed to remove repository', severity: 'error' });
    },
  });

  // Trigger analysis mutation
  const triggerAnalysisMutation = useMutation({
    mutationFn: () => CodebaseService.triggerAnalysis(codebaseId, { type: 'full' as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses', codebaseId] });
      queryClient.invalidateQueries({ queryKey: ['codebase', codebaseId] });
      setSnackbar({ open: true, message: 'Analysis started', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: error.message || 'Failed to start analysis', severity: 'error' });
    },
  });

  const handleAddRepo = () => {
    if (!newRepo.name.trim() || !newRepo.url.trim()) return;
    addRepoMutation.mutate(newRepo);
  };

  const handleDeleteRepo = (repoId: string, repoName: string) => {
    if (window.confirm(`Are you sure you want to remove "${repoName}"?`)) {
      deleteRepoMutation.mutate(repoId);
    }
  };

  const detectProvider = (url: string): RepositoryProvider => {
    if (url.includes('github.com')) return RepositoryProvider.GITHUB;
    if (url.includes('gitlab.com') || url.includes('gitlab')) return RepositoryProvider.GITLAB;
    if (url.includes('bitbucket')) return RepositoryProvider.BITBUCKET;
    if (url.includes('azure') || url.includes('dev.azure.com')) return RepositoryProvider.AZURE_DEVOPS;
    return RepositoryProvider.OTHER;
  };

  const extractRepoName = (url: string): string => {
    const match = url.match(/\/([^/]+?)(\.git)?$/);
    return match ? match[1].replace('.git', '') : '';
  };

  const handleUrlChange = (url: string) => {
    const provider = detectProvider(url);
    const name = extractRepoName(url);
    setNewRepo((prev) => ({ ...prev, url, provider, name: name || prev.name }));
  };

  const getProviderIcon = (provider: RepositoryProvider) => {
    switch (provider) {
      case RepositoryProvider.GITHUB:
        return <GitHubIcon />;
      default:
        return <StorageIcon />;
    }
  };

  if (authStatus === 'loading' || codebaseLoading) {
    return <LinearProgress />;
  }

  if (codebaseError || !codebase) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load codebase. Please try again.
          <Button onClick={() => router.back()} sx={{ ml: 2 }}>Go Back</Button>
        </Alert>
      </Container>
    );
  }

  const latestAnalysis = analyses.find((a: Analysis) => a.status === AnalysisStatus.COMPLETED);
  const runningAnalysis = analyses.find((a: Analysis) => a.status === AnalysisStatus.RUNNING);

  return (
    <Container maxWidth="xl">
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mt: 3, mb: 2 }}>
        <MuiLink
          component="button"
          underline="hover"
          color="inherit"
          onClick={() => router.push('/codeforge/codebases')}
        >
          Codebases
        </MuiLink>
        <Typography color="text.primary">{codebase.name}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              {codebase.name}
            </Typography>
            <Chip
              label={codebase.status}
              color={statusColors[codebase.status]}
              size="small"
            />
          </Box>
          <Typography variant="body1" color="text.secondary">
            {codebase.description || 'No description'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/codeforge/codebases')}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={runningAnalysis ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
            onClick={() => triggerAnalysisMutation.mutate()}
            disabled={triggerAnalysisMutation.isPending || !!runningAnalysis || repositories.length === 0}
          >
            {runningAnalysis ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FolderIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Repositories</Typography>
              </Box>
              <Typography variant="h3">{repositories.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon color="error" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Security Score</Typography>
              </Box>
              <Typography variant="h3">
                {latestAnalysis?.results?.securityScore || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BugReportIcon color="warning" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Total Findings</Typography>
              </Box>
              <Typography variant="h3">
                {latestAnalysis?.results?.findingsCount || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SpeedIcon color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Tech Debt Score</Typography>
              </Box>
              <Typography variant="h3">
                {latestAnalysis?.results?.techDebtScore || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={`Repositories (${repositories.length})`} />
          <Tab label={`Analysis History (${analyses.length})`} />
        </Tabs>
      </Box>

      {/* Repositories Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Connected Repositories</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetchRepos()}
              disabled={reposLoading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddRepoOpen(true)}
            >
              Add Repository
            </Button>
          </Box>
        </Box>

        {reposLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : repositories.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <FolderIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No repositories connected
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add repositories to start analyzing your code
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddRepoOpen(true)}>
              Add Repository
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Repository</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Files</TableCell>
                  <TableCell>Languages</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {repositories.map((repo: Repository) => (
                  <TableRow key={repo.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getProviderIcon(repo.provider)}
                        <Box>
                          <Typography variant="subtitle2">{repo.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                            {repo.url}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={repo.provider} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{repo.branch || 'main'}</TableCell>
                    <TableCell>
                      <Chip
                        label={repo.status}
                        size="small"
                        color={repoStatusColors[repo.status]}
                      />
                    </TableCell>
                    <TableCell>{repo.metadata?.totalFiles?.toLocaleString() || '-'}</TableCell>
                    <TableCell>
                      {repo.metadata?.languages ? (
                        Object.entries(repo.metadata.languages)
                          .slice(0, 2)
                          .map(([lang, pct]) => (
                            <Chip
                              key={lang}
                              label={`${lang} ${pct}%`}
                              size="small"
                              sx={{ mr: 0.5 }}
                              variant="outlined"
                            />
                          ))
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Remove Repository">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteRepo(repo.id, repo.name)}
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
      </TabPanel>

      {/* Analysis History Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" sx={{ mb: 2 }}>Analysis History</Typography>
        {analysesLoading ? (
          <CircularProgress />
        ) : analyses.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">No analyses yet. Run your first analysis!</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Files</TableCell>
                  <TableCell>Findings</TableCell>
                  <TableCell>Security Score</TableCell>
                  <TableCell>Started</TableCell>
                  <TableCell>Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyses.map((analysis: Analysis) => (
                  <TableRow
                    key={analysis.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/codeforge/analysis?codebaseId=${codebaseId}`)}
                  >
                    <TableCell>
                      <Chip label={analysis.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={analysis.status}
                        size="small"
                        color={
                          analysis.status === AnalysisStatus.COMPLETED ? 'success' :
                          analysis.status === AnalysisStatus.RUNNING ? 'info' :
                          analysis.status === AnalysisStatus.FAILED ? 'error' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{analysis.results?.filesAnalyzed?.toLocaleString() || '-'}</TableCell>
                    <TableCell>{analysis.results?.findingsCount || '-'}</TableCell>
                    <TableCell>{analysis.results?.securityScore || '-'}</TableCell>
                    <TableCell>
                      {analysis.startedAt ? new Date(analysis.startedAt).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      {analysis.startedAt && analysis.completedAt
                        ? `${Math.round((new Date(analysis.completedAt).getTime() - new Date(analysis.startedAt).getTime()) / 1000)}s`
                        : analysis.status === AnalysisStatus.RUNNING ? 'Running...' : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Add Repository Dialog */}
      <Dialog open={addRepoOpen} onClose={() => setAddRepoOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Repository</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Repository URL"
            placeholder="https://github.com/org/repo.git"
            fullWidth
            required
            value={newRepo.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            required
            value={newRepo.name}
            onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Provider</InputLabel>
                <Select
                  value={newRepo.provider}
                  label="Provider"
                  onChange={(e) => setNewRepo({ ...newRepo, provider: e.target.value as RepositoryProvider })}
                >
                  {Object.values(RepositoryProvider).map((provider) => (
                    <MenuItem key={provider} value={provider}>{provider}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Branch"
                fullWidth
                value={newRepo.branch}
                onChange={(e) => setNewRepo({ ...newRepo, branch: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddRepoOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddRepo}
            disabled={!newRepo.name.trim() || !newRepo.url.trim() || addRepoMutation.isPending}
          >
            {addRepoMutation.isPending ? <CircularProgress size={24} /> : 'Add Repository'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
