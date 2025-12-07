'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  InputAdornment,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GitHubIcon from '@mui/icons-material/GitHub';
import StorageIcon from '@mui/icons-material/Storage';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { CodebaseService, CreateCodebaseDto } from '@/services/codeforge/codebase.service';
import { RepositoryService, CreateRepositoryDto } from '@/services/codeforge/repository.service';
import { RepositoryProvider } from '@/types/codeforge';

const steps = ['Create Codebase', 'Connect Repositories', 'Run First Analysis'];

interface RepoToAdd {
  name: string;
  url: string;
  provider: RepositoryProvider;
  branch: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Codebase info
  const [codebaseName, setCodebaseName] = useState('');
  const [codebaseDescription, setCodebaseDescription] = useState('');
  const [createdCodebaseId, setCreatedCodebaseId] = useState<string | null>(null);

  // Step 2: Repositories
  const [repositories, setRepositories] = useState<RepoToAdd[]>([]);
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newRepoBranch, setNewRepoBranch] = useState('main');

  // Create codebase mutation
  const createCodebaseMutation = useMutation({
    mutationFn: (data: CreateCodebaseDto) => CodebaseService.create(data),
    onSuccess: (data) => {
      setCreatedCodebaseId(data.id);
      setActiveStep(1);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create codebase');
    },
  });

  // Add repositories mutation
  const addRepositoriesMutation = useMutation({
    mutationFn: async (repos: RepoToAdd[]) => {
      for (const repo of repos) {
        await RepositoryService.create({
          name: repo.name,
          remoteUrl: repo.url,
          provider: repo.provider,
          branch: repo.branch,
          codebaseId: createdCodebaseId!,
        });
      }
    },
    onSuccess: () => {
      setActiveStep(2);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to add repositories');
    },
  });

  // Trigger analysis mutation
  const triggerAnalysisMutation = useMutation({
    mutationFn: () => CodebaseService.triggerAnalysis(createdCodebaseId!, { type: 'full' as any }),
    onSuccess: () => {
      router.push(`/codeforge/codebases/${createdCodebaseId}`);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to trigger analysis');
    },
  });

  const detectProvider = (url: string): RepositoryProvider => {
    if (url.includes('github.com')) return RepositoryProvider.GITHUB;
    if (url.includes('gitlab.com') || url.includes('gitlab')) return RepositoryProvider.GITLAB;
    if (url.includes('bitbucket')) return RepositoryProvider.BITBUCKET;
    if (url.includes('azure') || url.includes('dev.azure.com')) return RepositoryProvider.AZURE_DEVOPS;
    return RepositoryProvider.OTHER;
  };

  const extractRepoName = (url: string): string => {
    const match = url.match(/\/([^/]+?)(\.git)?$/);
    return match ? match[1].replace('.git', '') : 'repository';
  };

  const handleAddRepository = () => {
    if (!newRepoUrl.trim()) return;

    const provider = detectProvider(newRepoUrl);
    const name = extractRepoName(newRepoUrl);

    setRepositories([
      ...repositories,
      {
        name,
        url: newRepoUrl.trim(),
        provider,
        branch: newRepoBranch || 'main',
      },
    ]);
    setNewRepoUrl('');
    setNewRepoBranch('main');
  };

  const handleRemoveRepository = (index: number) => {
    setRepositories(repositories.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setError(null);

    if (activeStep === 0) {
      if (!codebaseName.trim()) {
        setError('Please enter a codebase name');
        return;
      }
      createCodebaseMutation.mutate({
        name: codebaseName,
        description: codebaseDescription,
      });
    } else if (activeStep === 1) {
      if (repositories.length === 0) {
        setError('Please add at least one repository');
        return;
      }
      addRepositoriesMutation.mutate(repositories);
    } else if (activeStep === 2) {
      triggerAnalysisMutation.mutate();
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  const handleSkipToCodebases = () => {
    router.push('/codeforge/codebases');
  };

  const isLoading =
    createCodebaseMutation.isPending ||
    addRepositoriesMutation.isPending ||
    triggerAnalysisMutation.isPending;

  const getProviderIcon = (provider: RepositoryProvider) => {
    switch (provider) {
      case RepositoryProvider.GITHUB:
        return <GitHubIcon />;
      default:
        return <StorageIcon />;
    }
  };

  if (authStatus === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome to CodeForge
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Let's set up your first codebase for AI-powered analysis
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Create Your Codebase
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                A codebase is a collection of repositories that belong together, like a product or project.
              </Typography>

              <TextField
                fullWidth
                label="Codebase Name"
                placeholder="e.g., My SaaS Product"
                value={codebaseName}
                onChange={(e) => setCodebaseName(e.target.value)}
                sx={{ mb: 3 }}
                required
              />

              <TextField
                fullWidth
                label="Description (optional)"
                placeholder="What is this codebase for?"
                value={codebaseDescription}
                onChange={(e) => setCodebaseDescription(e.target.value)}
                multiline
                rows={3}
              />
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Connect Repositories
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Add the Git repositories you want to analyze. We support GitHub, GitLab, Bitbucket, and more.
              </Typography>

              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Repository URL"
                      placeholder="https://github.com/org/repo.git"
                      value={newRepoUrl}
                      onChange={(e) => setNewRepoUrl(e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Branch"
                      value={newRepoBranch}
                      onChange={(e) => setNewRepoBranch(e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddRepository}
                      disabled={!newRepoUrl.trim()}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              {repositories.length > 0 ? (
                <List>
                  {repositories.map((repo, index) => (
                    <div key={index}>
                      <ListItem>
                        <ListItemIcon>{getProviderIcon(repo.provider)}</ListItemIcon>
                        <ListItemText
                          primary={repo.name}
                          secondary={
                            <Box component="span" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                {repo.url}
                              </Typography>
                              <Chip label={repo.branch} size="small" variant="outlined" />
                              <Chip label={repo.provider} size="small" />
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleRemoveRepository(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < repositories.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <FolderIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                  <Typography>No repositories added yet</Typography>
                </Box>
              )}
            </Box>
          )}

          {activeStep === 2 && (
            <Box sx={{ textAlign: 'center' }}>
              <RocketLaunchIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Ready to Launch Analysis
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Your codebase "{codebaseName}" is set up with {repositories.length} repositor
                {repositories.length === 1 ? 'y' : 'ies'}. Click below to start the AI-powered
                analysis.
              </Typography>

              <Paper variant="outlined" sx={{ p: 3, mb: 3, textAlign: 'left' }}>
                <Typography variant="subtitle2" gutterBottom>
                  What happens next:
                </Typography>
                <List dense>
                  {[
                    'Clone and scan all repository files',
                    'Analyze code with Claude AI for security vulnerabilities',
                    'Calculate technical debt and maintainability scores',
                    'Generate actionable recommendations',
                  ].map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Typography variant="caption" color="text.secondary">
                Analysis typically takes 2-5 minutes depending on repository size.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={activeStep === 0 ? handleSkipToCodebases : handleBack}
          disabled={isLoading}
          startIcon={activeStep > 0 ? <ArrowBackIcon /> : undefined}
        >
          {activeStep === 0 ? 'Skip Setup' : 'Back'}
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isLoading}
          endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
        >
          {activeStep === steps.length - 1
            ? 'Start Analysis'
            : activeStep === 0
            ? 'Create Codebase'
            : 'Continue'}
        </Button>
      </Box>
    </Container>
  );
}
