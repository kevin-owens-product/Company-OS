'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  RadioGroup,
  Radio,
  FormControlLabel,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SecurityIcon from '@mui/icons-material/Security';
import BuildIcon from '@mui/icons-material/Build';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import { CodebaseService } from '@/services/codeforge/codebase.service';
import { PlaybookService } from '@/services/codeforge/playbook.service';
import { TransformationService, CreateTransformationDto } from '@/services/codeforge/transformation.service';
import { RepositoryService } from '@/services/codeforge/repository.service';
import {
  Codebase,
  Repository,
  Playbook,
  PlaybookCategory,
  OversightLevel,
} from '@/types/codeforge';

const steps = ['Select Codebase', 'Choose Playbook', 'Configure Options', 'Review & Execute'];

const categoryIcons: Record<PlaybookCategory, React.ReactNode> = {
  [PlaybookCategory.CONSOLIDATION]: <ArchitectureIcon />,
  [PlaybookCategory.SECURITY]: <SecurityIcon />,
  [PlaybookCategory.COST_OPTIMIZATION]: <DeleteSweepIcon />,
  [PlaybookCategory.DEVELOPER_EXPERIENCE]: <UpgradeIcon />,
  [PlaybookCategory.COMPLIANCE]: <BuildIcon />,
  [PlaybookCategory.CUSTOM]: <BuildIcon />,
};

const oversightLevelDescriptions: Record<OversightLevel, string> = {
  [OversightLevel.AUTONOMOUS]: 'Execute automatically without approval',
  [OversightLevel.NOTIFY]: 'Execute and notify after completion',
  [OversightLevel.REVIEW]: 'Require approval before execution',
  [OversightLevel.COLLABORATE]: 'Interactive step-by-step execution',
  [OversightLevel.MANUAL]: 'Generate plan only, manual execution',
};

function NewTransformationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status: authStatus } = useSession();

  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Codebase selection
  const [selectedCodebaseId, setSelectedCodebaseId] = useState<string>(searchParams?.get('codebaseId') || '');

  // Step 2: Playbook selection
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<PlaybookCategory | 'all'>('all');

  // Step 3: Configuration
  const [selectedRepoIds, setSelectedRepoIds] = useState<string[]>([]);
  const [oversightLevel, setOversightLevel] = useState<OversightLevel>(OversightLevel.REVIEW);
  const [createPullRequest, setCreatePullRequest] = useState(true);
  const [dryRun, setDryRun] = useState(false);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [authStatus, router]);

  // Fetch codebases
  const { data: codebases = [], isLoading: codebasesLoading } = useQuery({
    queryKey: ['codebases'],
    queryFn: CodebaseService.findAll,
    enabled: authStatus === 'authenticated',
  });

  // Fetch playbooks
  const { data: playbooks = [], isLoading: playbooksLoading } = useQuery({
    queryKey: ['playbooks'],
    queryFn: () => PlaybookService.findAll(),
    enabled: authStatus === 'authenticated',
  });

  // Fetch repositories for selected codebase
  const { data: repositories = [], isLoading: reposLoading } = useQuery({
    queryKey: ['repositories', selectedCodebaseId],
    queryFn: () => RepositoryService.findAll(selectedCodebaseId),
    enabled: !!selectedCodebaseId,
  });

  // Create transformation mutation
  const createTransformationMutation = useMutation({
    mutationFn: (data: Omit<CreateTransformationDto, 'codebaseId'>) =>
      TransformationService.create({ ...data, codebaseId: selectedCodebaseId }),
    onSuccess: (data) => {
      router.push(`/codeforge/transformations?highlight=${data.id}`);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create transformation');
    },
  });

  const selectedCodebase = codebases.find((cb: Codebase) => cb.id === selectedCodebaseId);
  const selectedPlaybook = playbooks.find((pb: Playbook) => pb.id === selectedPlaybookId);

  const filteredPlaybooks = categoryFilter === 'all'
    ? playbooks
    : playbooks.filter((pb: Playbook) => pb.category === categoryFilter);

  const handleNext = () => {
    setError(null);

    if (activeStep === 0 && !selectedCodebaseId) {
      setError('Please select a codebase');
      return;
    }
    if (activeStep === 1 && !selectedPlaybookId) {
      setError('Please select a playbook');
      return;
    }
    if (activeStep === 2 && selectedRepoIds.length === 0) {
      setError('Please select at least one repository');
      return;
    }
    if (activeStep === steps.length - 1) {
      // Execute
      createTransformationMutation.mutate({
        name: selectedPlaybook?.name || 'Transformation',
        type: 'playbook_execution' as any,
        oversightLevel,
        scope: {
          repositories: selectedRepoIds,
          playbooks: [selectedPlaybookId],
        },
      });
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  const handleToggleRepo = (repoId: string) => {
    setSelectedRepoIds((prev) =>
      prev.includes(repoId) ? prev.filter((id) => id !== repoId) : [...prev, repoId]
    );
  };

  const handleSelectAllRepos = () => {
    if (selectedRepoIds.length === repositories.length) {
      setSelectedRepoIds([]);
    } else {
      setSelectedRepoIds(repositories.map((r: Repository) => r.id));
    }
  };

  // Auto-select all repos when entering step 3
  useEffect(() => {
    if (activeStep === 2 && selectedRepoIds.length === 0 && repositories.length > 0) {
      setSelectedRepoIds(repositories.map((r: Repository) => r.id));
    }
  }, [activeStep, repositories, selectedRepoIds.length]);

  if (authStatus === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink
          component="button"
          underline="hover"
          color="inherit"
          onClick={() => router.push('/codeforge/transformations')}
        >
          Transformations
        </MuiLink>
        <Typography color="text.primary">New Transformation</Typography>
      </Breadcrumbs>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Create New Transformation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Configure and execute a code transformation using a playbook
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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
          {/* Step 1: Select Codebase */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Codebase
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose the codebase you want to transform
              </Typography>

              {codebasesLoading ? (
                <CircularProgress />
              ) : (
                <FormControl fullWidth>
                  <InputLabel>Codebase</InputLabel>
                  <Select
                    value={selectedCodebaseId}
                    label="Codebase"
                    onChange={(e) => {
                      setSelectedCodebaseId(e.target.value);
                      setSelectedRepoIds([]);
                    }}
                  >
                    {codebases.map((cb: Codebase) => (
                      <MenuItem key={cb.id} value={cb.id}>
                        {cb.name}
                        <Chip
                          label={cb.status}
                          size="small"
                          sx={{ ml: 1 }}
                          variant="outlined"
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}

          {/* Step 2: Choose Playbook */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Choose Playbook
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select a transformation playbook to apply
              </Typography>

              <FormControl sx={{ mb: 3, minWidth: 200 }}>
                <InputLabel>Category Filter</InputLabel>
                <Select
                  value={categoryFilter as string}
                  label="Category Filter"
                  onChange={(e) => setCategoryFilter(e.target.value as PlaybookCategory | 'all')}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {Object.values(PlaybookCategory).map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat.replace(/_/g, ' ')}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {playbooksLoading ? (
                <CircularProgress />
              ) : (
                <Grid container spacing={2}>
                  {filteredPlaybooks.map((playbook: Playbook) => (
                    <Grid item xs={12} md={6} key={playbook.id}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          border: selectedPlaybookId === playbook.id ? 2 : 1,
                          borderColor: selectedPlaybookId === playbook.id ? 'primary.main' : 'divider',
                          '&:hover': { borderColor: 'primary.light' },
                        }}
                        onClick={() => setSelectedPlaybookId(playbook.id)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{ color: 'primary.main' }}>
                            {categoryIcons[playbook.category]}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {playbook.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {playbook.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip
                                label={playbook.category.replace(/_/g, ' ')}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={playbook.isBuiltIn ? 'Built-in' : 'Custom'}
                                size="small"
                                color={playbook.isBuiltIn ? 'primary' : 'default'}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {/* Step 3: Configure Options */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Configure Transformation
              </Typography>

              {/* Repository Selection */}
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">Target Repositories</Typography>
                  <Button size="small" onClick={handleSelectAllRepos}>
                    {selectedRepoIds.length === repositories.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </Box>
                {reposLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  <List dense>
                    {repositories.map((repo: Repository) => (
                      <ListItem key={repo.id} disablePadding>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={selectedRepoIds.includes(repo.id)}
                            onChange={() => handleToggleRepo(repo.id)}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={repo.name}
                          secondary={repo.remoteUrl}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>

              {/* Oversight Level */}
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Oversight Level
                </Typography>
                <RadioGroup
                  value={oversightLevel}
                  onChange={(e) => setOversightLevel(e.target.value as OversightLevel)}
                >
                  {Object.entries(oversightLevelDescriptions).map(([level, desc]) => (
                    <FormControlLabel
                      key={level}
                      value={level}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {level.replace(/_/g, ' ')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {desc}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </Paper>

              {/* Additional Options */}
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Additional Options
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={createPullRequest}
                      onChange={(e) => setCreatePullRequest(e.target.checked)}
                    />
                  }
                  label="Create pull request for changes"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dryRun}
                      onChange={(e) => setDryRun(e.target.checked)}
                    />
                  }
                  label="Dry run (preview changes without applying)"
                />
              </Paper>
            </Box>
          )}

          {/* Step 4: Review */}
          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review & Execute
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Review your configuration before starting the transformation
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Codebase
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedCodebase?.name}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Playbook
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedPlaybook?.name}
                    </Typography>
                    <Chip
                      label={selectedPlaybook?.category.replace(/_/g, ' ')}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Target Repositories
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedRepoIds.length} of {repositories.length} repositories
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Oversight Level
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {oversightLevel.replace(/_/g, ' ')}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Options
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {createPullRequest && (
                        <Chip label="Create PR" size="small" color="primary" />
                      )}
                      {dryRun && (
                        <Chip label="Dry Run" size="small" color="warning" />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {dryRun && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  This is a dry run. Changes will be previewed but not applied.
                </Alert>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={activeStep === 0 ? () => router.push('/codeforge/transformations') : handleBack}
          startIcon={<ArrowBackIcon />}
          disabled={createTransformationMutation.isPending}
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          endIcon={
            createTransformationMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              <PlayArrowIcon />
            ) : (
              <ArrowForwardIcon />
            )
          }
          disabled={createTransformationMutation.isPending}
        >
          {activeStep === steps.length - 1 ? 'Start Transformation' : 'Continue'}
        </Button>
      </Box>
    </Container>
  );
}

export default function NewTransformationPage() {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>}>
      <NewTransformationContent />
    </Suspense>
  );
}
