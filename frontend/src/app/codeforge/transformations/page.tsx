'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UndoIcon from '@mui/icons-material/Undo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Transformation {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'rolled_back' | 'cancelled';
  oversightLevel: string;
  codebaseName: string;
  progress: number;
  createdAt: string;
  output?: {
    prUrl?: string;
    filesModified?: number;
  };
}

const statusConfig: Record<string, { color: 'default' | 'warning' | 'info' | 'success' | 'error' | 'primary' | 'secondary'; label: string }> = {
  draft: { color: 'default', label: 'Draft' },
  pending_approval: { color: 'warning', label: 'Pending Approval' },
  approved: { color: 'info', label: 'Approved' },
  queued: { color: 'secondary', label: 'Queued' },
  running: { color: 'primary', label: 'Running' },
  paused: { color: 'warning', label: 'Paused' },
  completed: { color: 'success', label: 'Completed' },
  failed: { color: 'error', label: 'Failed' },
  rolled_back: { color: 'default', label: 'Rolled Back' },
  cancelled: { color: 'default', label: 'Cancelled' },
};

export default function TransformationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // TODO: Fetch transformations from API
    setTransformations([
      {
        id: '1',
        name: 'Security Dependency Update Q4',
        type: 'dependency_update',
        status: 'completed',
        oversightLevel: 'review',
        codebaseName: 'Legacy ERP System',
        progress: 100,
        createdAt: '2024-11-15',
        output: { prUrl: 'https://github.com/org/repo/pull/123', filesModified: 45 },
      },
      {
        id: '2',
        name: 'Dead Code Cleanup - Frontend',
        type: 'dead_code_removal',
        status: 'running',
        oversightLevel: 'review',
        codebaseName: 'Customer Portal',
        progress: 65,
        createdAt: '2024-12-01',
      },
      {
        id: '3',
        name: 'React Migration Phase 1',
        type: 'migrate',
        status: 'pending_approval',
        oversightLevel: 'collaborate',
        codebaseName: 'Legacy ERP System',
        progress: 0,
        createdAt: '2024-12-05',
      },
      {
        id: '4',
        name: 'API Security Hardening',
        type: 'security_fix',
        status: 'draft',
        oversightLevel: 'review',
        codebaseName: 'Customer Portal',
        progress: 0,
        createdAt: '2024-12-06',
      },
    ]);
    setLoading(false);
  }, []);

  if (status === 'loading' || loading) {
    return <LinearProgress />;
  }

  const getActionButtons = (transformation: Transformation) => {
    switch (transformation.status) {
      case 'draft':
        return (
          <>
            <Tooltip title="Submit for Approval">
              <IconButton size="small" color="primary">
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      case 'pending_approval':
        return (
          <>
            <Tooltip title="Approve">
              <IconButton size="small" color="success">
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      case 'approved':
      case 'queued':
        return (
          <>
            <Tooltip title="Execute">
              <IconButton size="small" color="primary">
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton size="small" color="error">
                <StopIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      case 'running':
        return (
          <>
            <Tooltip title="Pause">
              <IconButton size="small" color="warning">
                <PauseIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton size="small" color="error">
                <StopIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      case 'paused':
        return (
          <>
            <Tooltip title="Resume">
              <IconButton size="small" color="primary">
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton size="small" color="error">
                <StopIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      case 'completed':
        return (
          <>
            <Tooltip title="Rollback">
              <IconButton size="small" color="warning">
                <UndoIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      default:
        return null;
    }
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/codeforge/transformations/new')}
        >
          New Transformation
        </Button>
      </Box>

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
            {transformations.map((transformation) => (
              <TableRow key={transformation.id} hover>
                <TableCell>
                  <Typography variant="subtitle2">{transformation.name}</Typography>
                  {transformation.output?.prUrl && (
                    <Typography variant="caption" color="primary">
                      PR #{transformation.output.prUrl.split('/').pop()}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={transformation.type.replace('_', ' ')}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{transformation.codebaseName}</TableCell>
                <TableCell>
                  <Chip
                    label={statusConfig[transformation.status]?.label || transformation.status}
                    size="small"
                    color={statusConfig[transformation.status]?.color || 'default'}
                  />
                </TableCell>
                <TableCell>
                  {transformation.status === 'running' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={transformation.progress}
                        sx={{ width: 100 }}
                      />
                      <Typography variant="caption">{transformation.progress}%</Typography>
                    </Box>
                  ) : transformation.status === 'completed' ? (
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
    </Container>
  );
}
