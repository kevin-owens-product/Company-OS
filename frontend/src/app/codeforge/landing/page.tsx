'use client';

import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  useTheme,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function CodeForgeLandingPage() {
  const router = useRouter();
  const theme = useTheme();

  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 48 }} />,
      title: 'Universal Code Ingestion',
      description: 'Connect any repository from GitHub, GitLab, Bitbucket, or even legacy systems like SVN and Perforce.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: 'AI-Powered Security Analysis',
      description: 'Detect vulnerabilities, hardcoded secrets, and security anti-patterns with Claude-powered analysis.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48 }} />,
      title: 'Technical Debt Scoring',
      description: 'Get actionable metrics on code quality, maintainability, and technical debt across your portfolio.',
    },
    {
      icon: <AutoFixHighIcon sx={{ fontSize: 48 }} />,
      title: 'Automated Transformations',
      description: 'Execute code refactoring, dependency updates, and modernization with human-in-the-loop oversight.',
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 48 }} />,
      title: 'Playbook Library',
      description: 'Pre-built transformation patterns for common scenarios: security hardening, dead code removal, and more.',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 48 }} />,
      title: 'PE Portfolio View',
      description: 'Aggregate technology assessments across all portfolio companies for informed investment decisions.',
    },
  ];

  const useCases = [
    {
      title: 'Due Diligence',
      time: '2 weeks',
      oldTime: '3-6 months',
      description: 'Complete technology assessment during acquisition due diligence',
    },
    {
      title: 'Post-Acquisition',
      time: '60-80%',
      oldTime: 'cost reduction',
      description: 'Modernize legacy systems at a fraction of traditional consulting costs',
    },
    {
      title: 'Portfolio Standardization',
      time: 'Unified',
      oldTime: 'view',
      description: 'Standardize technology practices across multiple portfolio companies',
    },
  ];

  const testimonials = [
    {
      quote: 'CodeForge reduced our technology due diligence from 4 months to 2 weeks. Game changer for our deal flow.',
      author: 'Operating Partner',
      company: 'Growth Equity Firm',
    },
    {
      quote: 'We identified $2M in annual savings through dead code removal and infrastructure consolidation.',
      author: 'CTO',
      company: 'Portfolio Company',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="AI-Powered Code Transformation"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', mb: 2 }}
              />
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Transform Legacy Code at Scale
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, mb: 4 }}>
                CodeForge helps PE firms and enterprises modernize technology portfolios
                with AI-powered analysis and autonomous refactoring.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                  onClick={() => router.push('/codeforge/onboarding')}
                  endIcon={<ArrowForwardIcon />}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ borderColor: 'white', color: 'white' }}
                  onClick={() => router.push('/codeforge/pricing')}
                >
                  View Pricing
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  bgcolor: 'rgba(0,0,0,0.2)',
                  borderRadius: 2,
                  p: 3,
                  fontFamily: 'monospace',
                  fontSize: 14,
                }}
              >
                <Typography sx={{ color: '#4ade80' }}>$ codeforge analyze</Typography>
                <Typography sx={{ opacity: 0.7, mt: 1 }}>Scanning 2,450 files...</Typography>
                <Typography sx={{ opacity: 0.7 }}>Running AI analysis...</Typography>
                <Typography sx={{ color: '#f87171', mt: 1 }}>Found 12 critical vulnerabilities</Typography>
                <Typography sx={{ color: '#fbbf24' }}>Found 45 high-severity issues</Typography>
                <Typography sx={{ color: '#4ade80', mt: 1 }}>Security Score: 72/100</Typography>
                <Typography sx={{ color: '#4ade80' }}>Tech Debt Score: 65/100</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Metrics Bar */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" textAlign="center">
            <Grid item xs={6} md={3}>
              <Typography variant="h3" fontWeight="bold">2 weeks</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>vs 3-6 months for assessment</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" fontWeight="bold">70%</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>cost reduction vs consulting</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" fontWeight="bold">99%</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>CVE detection rate</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" fontWeight="bold">50+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>languages supported</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
          Everything You Need to Modernize Code
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          From assessment to execution, CodeForge provides end-to-end technology transformation
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Use Cases Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            Built for Private Equity
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Accelerate value creation across your technology portfolio
          </Typography>
          <Grid container spacing={4}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      {useCase.time}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {useCase.oldTime}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }} fontWeight="bold">
                      {useCase.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {useCase.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {[
            { step: '1', title: 'Connect', desc: 'Link your repositories from any source control system' },
            { step: '2', title: 'Analyze', desc: 'AI scans your code for security, quality, and debt' },
            { step: '3', title: 'Plan', desc: 'Select playbooks and review transformation plans' },
            { step: '4', title: 'Transform', desc: 'Execute changes with human oversight and rollback' },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} textAlign="center">
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              >
                {item.step}
              </Box>
              <Typography variant="h6" fontWeight="bold">{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontStyle: 'italic', mb: 2 }}>
                      "{testimonial.quote}"
                    </Typography>
                    <Typography variant="subtitle2">
                      {testimonial.author}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {testimonial.company}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Ready to Transform Your Code?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Start with a free assessment of your codebase. No credit card required.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/codeforge/onboarding')}
            endIcon={<ArrowForwardIcon />}
          >
            Start Free Trial
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/codeforge/pricing')}
          >
            Compare Plans
          </Button>
        </Stack>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          {['No credit card', 'Free assessment', '14-day trial', 'Cancel anytime'].map((item) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="body2" color="text.secondary">{item}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
