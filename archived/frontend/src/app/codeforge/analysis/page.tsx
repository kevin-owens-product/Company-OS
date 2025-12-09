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
  Grid,
  Chip,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import SpeedIcon from '@mui/icons-material/Speed';
import { CodebaseService } from '@/services/codeforge/codebase.service';
import { AnalysisService } from '@/services/codeforge/analysis.service';
import { Analysis, AnalysisStatus, AnalysisType, Codebase, Finding, FindingSeverity } from '@/types/codeforge';

const analysisTypeLabels: Record<AnalysisType, string> = {
  [AnalysisType.FULL]: 'Full Analysis',
  [AnalysisType.INCREMENTAL]: 'Incremental',
  [AnalysisType.SECURITY]: 'Security Scan',
  [AnalysisType.DEPENDENCIES]: 'Dependency Audit',
  [AnalysisType.DEAD_CODE]: 'Dead Code Detection',
  [AnalysisType.ARCHITECTURE]: 'Architecture Review',
};

const statusColors: Record<AnalysisStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  [AnalysisStatus.QUEUED]: 'default',
  [AnalysisStatus.RUNNING]: 'info',
  [AnalysisStatus.COMPLETED]: 'success',
  [AnalysisStatus.FAILED]: 'error',
  [AnalysisStatus.CANCELLED]: 'warning',
};

const severityColors: Record<FindingSeverity, string> = {
  [FindingSeverity.CRITICAL]: '#d32f2f',
  [FindingSeverity.HIGH]: '#f44336',
  [FindingSeverity.MEDIUM]: '#ff9800',
  [FindingSeverity.LOW]: '#2196f3',
  [FindingSeverity.INFO]: '#9e9e9e',
};

export default function AnalysisPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const [selectedCodebase, setSelectedCodebase] = useState<string>('');
  const [newAnalysisOpen, setNewAnalysisOpen] = useState(false);
  const [analysisType, setAnalysisType] = useState<AnalysisType>(AnalysisType.FULL);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

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

  // Fetch analyses for selected codebase
  const { data: analyses = [], isLoading: analysesLoading, refetch: refetchAnalyses } = useQuery({
    queryKey: ['analyses', selectedCodebase],
    queryFn: () => CodebaseService.getAnalyses(selectedCodebase),
    enabled: !!selectedCodebase,
  });

  // Fetch findings for selected analysis
  const { data: findings = [], isLoading: findingsLoading } = useQuery({
    queryKey: ['findings', selectedAnalysis?.id],
    queryFn: () => AnalysisService.getFindings(selectedAnalysis!.id),
    enabled: !!selectedAnalysis,
  });

  const handleTriggerAnalysis = async () => {
    if (!selectedCodebase) return;
    try {
      await CodebaseService.triggerAnalysis(selectedCodebase, { type: analysisType });
      setNewAnalysisOpen(false);
      refetchAnalyses();
    } catch (error) {
      console.error('Failed to trigger analysis:', error);
    }
  };

  const handleCancelAnalysis = async (analysisId: string) => {
    try {
      await AnalysisService.cancel(analysisId);
      refetchAnalyses();
    } catch (error) {
      console.error('Failed to cancel analysis:', error);
    }
  };

  if (authStatus === 'loading') {
    return <LinearProgress />;
  }

  const completedAnalyses = analyses.filter((a: Analysis) => a.status === AnalysisStatus.COMPLETED);
  const latestAnalysis = completedAnalyses[0];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Code Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-powered code analysis with security, quality, and architecture insights
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Select Codebase</InputLabel>
            <Select
              value={selectedCodebase}
              label="Select Codebase"
              onChange={(e) => {
                setSelectedCodebase(e.target.value);
                setSelectedAnalysis(null);
              }}
            >
              {codebases.map((cb: Codebase) => (
                <MenuItem key={cb.id} value={cb.id}>{cb.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => setNewAnalysisOpen(true)}
            disabled={!selectedCodebase}
          >
            New Analysis
          </Button>
        </Box>
      </Box>

      {!selectedCodebase ? (
        <Alert severity="info">
          Select a codebase to view and run analyses
        </Alert>
      ) : analysesLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          {latestAnalysis?.results && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SecurityIcon color="error" sx={{ mr: 1 }} />
                      <Typography color="text.secondary">Security Score</Typography>
                    </Box>
                    <Typography variant="h3">
                      {latestAnalysis.results.securityScore || 'N/A'}
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
                      {latestAnalysis.results.findingsCount || 0}
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
                      {latestAnalysis.results.techDebtScore || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Findings by Severity
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {latestAnalysis.results.findingsBySeverity && Object.entries(latestAnalysis.results.findingsBySeverity).map(([severity, count]) => (
                        <Chip
                          key={severity}
                          label={`${severity}: ${count}`}
                          size="small"
                          sx={{ bgcolor: severityColors[severity as FindingSeverity], color: 'white' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Analysis History */}
          <Typography variant="h6" gutterBottom>Analysis History</Typography>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Files Analyzed</TableCell>
                  <TableCell>Findings</TableCell>
                  <TableCell>Started</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analyses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">No analyses yet. Run your first analysis!</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  analyses.map((analysis: Analysis) => (
                    <TableRow
                      key={analysis.id}
                      hover
                      selected={selectedAnalysis?.id === analysis.id}
                      onClick={() => setSelectedAnalysis(analysis)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Chip label={analysisTypeLabels[analysis.type]} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={analysis.status}
                          size="small"
                          color={statusColors[analysis.status]}
                        />
                      </TableCell>
                      <TableCell>{analysis.results?.filesAnalyzed?.toLocaleString() || '-'}</TableCell>
                      <TableCell>{analysis.results?.findingsCount || '-'}</TableCell>
                      <TableCell>
                        {analysis.startedAt ? new Date(analysis.startedAt).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>
                        {analysis.startedAt && analysis.completedAt
                          ? `${Math.round((new Date(analysis.completedAt).getTime() - new Date(analysis.startedAt).getTime()) / 1000)}s`
                          : analysis.status === AnalysisStatus.RUNNING ? 'Running...' : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {analysis.status === AnalysisStatus.RUNNING && (
                          <Button
                            size="small"
                            color="error"
                            startIcon={<StopIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelAnalysis(analysis.id);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAnalysis(analysis);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Findings Panel */}
          {selectedAnalysis && (
            <>
              <Typography variant="h6" gutterBottom>
                Findings from {analysisTypeLabels[selectedAnalysis.type]}
                {selectedAnalysis.summary?.overview && (
                  <Typography variant="body2" color="text.secondary">
                    {selectedAnalysis.summary.overview}
                  </Typography>
                )}
              </Typography>
              {findingsLoading ? (
                <CircularProgress />
              ) : findings.length === 0 ? (
                <Alert severity="success">No findings detected in this analysis</Alert>
              ) : (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Severity</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>File</TableCell>
                        <TableCell>Line</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {findings.map((finding: Finding) => (
                        <TableRow key={finding.id} hover>
                          <TableCell>
                            <Chip
                              label={finding.severity}
                              size="small"
                              sx={{ bgcolor: severityColors[finding.severity], color: 'white' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{finding.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {finding.description.substring(0, 100)}...
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={finding.category.replace('_', ' ')} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                              {finding.filePath || finding.location?.file || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>{finding.lineStart || finding.location?.startLine || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </>
      )}

      {/* New Analysis Dialog */}
      <Dialog open={newAnalysisOpen} onClose={() => setNewAnalysisOpen(false)}>
        <DialogTitle>Run New Analysis</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Analysis Type</InputLabel>
            <Select
              value={analysisType}
              label="Analysis Type"
              onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
            >
              {Object.entries(analysisTypeLabels).map(([type, label]) => (
                <MenuItem key={type} value={type}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewAnalysisOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleTriggerAnalysis}>
            Start Analysis
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
