'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UndoIcon from '@mui/icons-material/Undo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TransformationService } from '@/services/codeforge/transformation.service';
import { CodebaseService } from '@/services/codeforge/codebase.service';
import { Transformation, TransformationStatus, Codebase } from '@/types/codeforge';

const statusConfig: Record<TransformationStatus, { color: 'default' | 'warning' | 'info' | 'success' | 'error' | 'primary' | 'secondary'; label: string }> = {
  [TransformationStatus.DRAFT]: { color: 'default', label: 'Draft' },
  [TransformationStatus.PENDING_APPROVAL]: { color: 'warning', label: 'Pending Approval' },
  [TransformationStatus.APPROVED]: { color: 'info', label: 'Approved' },
  [TransformationStatus.QUEUED]: { color: 'secondary', label: 'Queued' },
  [TransformationStatus.RUNNING]: { color: 'primary', label: 'Running' },
  [TransformationStatus.PAUSED]: { color: 'warning', label: 'Paused' },
  [TransformationStatus.COMPLETED]: { color: 'success', label: 'Completed' },
  [TransformationStatus.FAILED]: { color: 'error', label: 'Failed' },
  [TransformationStatus.ROLLED_BACK]: { color: 'default', label: 'Rolled Back' },
  [TransformationStatus.CANCELLED]: { color: 'default', label: 'Cancelled' },
};

export default function TransformationsPage() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [selectedCodebase, setSelectedCodebase] = useState<string>(searchParams.get('codebaseId') || '');
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

  // Fetch codebases for filter
  const { data: codebases = [] } = useQuery({
    queryKey: ['codebases'],
    queryFn: CodebaseService.findAll,
    enabled: authStatus === 'authenticated',
  });

  // Fetch transformations
  const { data: transformations = [], isLoading, error } = useQuery({
    queryKey: ['transformations', selectedCodebase],
    queryFn: () => TransformationService.findAll(selectedCodebase),
    enabled: authStatus === 'authenticated' && !!selectedCodebase,
  });

  // Action mutations
  const actionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      switch (action) {
        case 'submit': return TransformationService.submitForApproval(id);
        case 'approve': return TransformationService.approve(id);
        case 'execute': return TransformationService.execute(id);
        case 'pause': return TransformationService.pause(id);
        case 'resume': return TransformationService.resume(id);
        case 'cancel': return TransformationService.cancel(id);
        case 'rollback': return TransformationService.rollback(id);
        default: throw new Error('Unknown action');
      }
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['transformations'] });
      setSnackbar({ open: true, message: `Action "${action}" completed successfully`, severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: error.message || 'Action failed', severity: 'error' });
    },
  });

  const handleAction = (id: string, action: string) => {
    actionMutation.mutate({ id, action });
  };

  if (authStatus === 'loading') {
    return <LinearProgress />;
  }

  const getActionButtons = (transformation: Transformation) => {
    const buttons: JSX.Element[] = [];

    switch (transformation.status) {
      case TransformationStatus.DRAFT:
        buttons.push(
          <Tooltip key="submit" title="Submit for Approval">
            <IconButton size="small" color="primary" onClick={() => handleAction(transformation.id, 'submit')}>
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
        );
        break;
      case TransformationStatus.PENDING_APPROVAL:
        buttons.push(
          <Tooltip key="approve" title="Approve">
            <IconButton size="small" color="success" onClick={() => handleAction(transformation.id, 'approve')}>
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
        );
        break;
      case TransformationStatus.APPROVED:
      case TransformationStatus.QUEUED:
        buttons.push(
          <Tooltip key="execute" title="Execute">
            <IconButton size="small" color="primary" onClick={() => handleAction(transformation.id, 'execute')}>
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip key="cancel" title="Cancel">
            <IconButton size="small" color="error" onClick={() => handleAction(transformation.id, 'cancel')}>
              <StopIcon />
            </IconButton>
          </Tooltip>
        );
        break;
      case TransformationStatus.RUNNING:
        buttons.push(
          <Tooltip key="pause" title="Pause">
            <IconButton size="small" color="warning" onClick={() => handleAction(transformation.id, 'pause')}>
              <PauseIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip key="cancel" title="Cancel">
            <IconButton size="small" color="error" onClick={() => handleAction(transformation.id, 'cancel')}>
              <StopIcon />
            </IconButton>
          </Tooltip>
        );
        break;
      case TransformationStatus.PAUSED:
        buttons.push(
          <Tooltip key="resume" title="Resume">
            <IconButton size="small" color="primary" onClick={() => handleAction(transformation.id, 'resume')}>
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>,
          <Tooltip key="cancel" title="Cancel">
            <IconButton size="small" color="error" onClick={() => handleAction(transformation.id, 'cancel')}>
              <StopIcon />
            </IconButton>
          </Tooltip>
        );
        break;
      case TransformationStatus.COMPLETED:
        if (transformation.rollback?.available) {
          buttons.push(
            <Tooltip key="rollback" title="Rollback">
              <IconButton size="small" color="warning" onClick={() => handleAction(transformation.id, 'rollback')}>
                <UndoIcon />
              </IconButton>
            </Tooltip>
          );
        }
        break;
    }
    return buttons;
  };

  // Get codebase name helper
  const getCodebaseName = (codebaseId: string) => {
    const codebase = codebases.find((c: Codebase) => c.id === codebaseId);
    return codebase?.name || 'Unknown';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Transformations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and manage code transformation executions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filter by Codebase</InputLabel>
            <Select
              value={selectedCodebase}
              label="Filter by Codebase"
              onChange={(e) => setSelectedCodebase(e.target.value)}
            >
              <MenuItem value="">Select a Codebase</MenuItem>
              {codebases.map((cb: Codebase) => (
                <MenuItem key={cb.id} value={cb.id}>{cb.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/codeforge/transformations/new')}
          >
            New Transformation
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load transformations. Please try again.
        </Alert>
      )}

      {!selectedCodebase ? (
        <Alert severity="info">
          Select a codebase to view its transformations
        </Alert>
      ) : isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : transformations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No transformations yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create a transformation to start modernizing your codebase
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push('/codeforge/transformations/new')}>
            New Transformation
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Codebase</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Oversight</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transformations.map((transformation: Transformation) => (
                <TableRow key={transformation.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{transformation.name}</Typography>
                    {transformation.output?.prUrl && (
                      <Typography variant="caption" color="primary" component="a" href={transformation.output.prUrl} target="_blank">
                        PR #{transformation.output.prUrl.split('/').pop()}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transformation.type.replace(/_/g, ' ')}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{getCodebaseName(transformation.codebaseId)}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusConfig[transformation.status]?.label || transformation.status}
                      size="small"
                      color={statusConfig[transformation.status]?.color || 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {transformation.status === TransformationStatus.RUNNING ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={transformation.execution?.progress || 0}
                          sx={{ width: 100 }}
                        />
                        <Typography variant="caption">{transformation.execution?.progress || 0}%</Typography>
                      </Box>
                    ) : transformation.status === TransformationStatus.COMPLETED ? (
                      <Typography variant="caption" color="success.main">100%</Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transformation.oversightLevel}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{new Date(transformation.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => router.push(`/codeforge/transformations/${transformation.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {getActionButtons(transformation)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
