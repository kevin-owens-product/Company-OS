'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    repositories: string;
    analysesPerMonth: string;
    playbooks: string;
    teamMembers: string;
    support: string;
  };
  popular?: boolean;
  cta: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    description: 'For individual developers and small teams exploring code analysis',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Up to 3 repositories',
      '5 analyses per month',
      'Basic security scanning',
      'Community playbooks',
      'Email support',
    ],
    limits: {
      repositories: '3',
      analysesPerMonth: '5',
      playbooks: 'Community',
      teamMembers: '1',
      support: 'Email',
    },
    cta: 'Get Started Free',
  },
  {
    name: 'Professional',
    description: 'For growing teams that need comprehensive code analysis',
    monthlyPrice: 299,
    yearlyPrice: 249,
    features: [
      'Up to 25 repositories',
      'Unlimited analyses',
      'Full security & vulnerability scanning',
      'All playbooks included',
      'Transformation execution',
      'API access',
      'Priority support',
    ],
    limits: {
      repositories: '25',
      analysesPerMonth: 'Unlimited',
      playbooks: 'All',
      teamMembers: '10',
      support: 'Priority',
    },
    popular: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    description: 'For PE firms and large organizations with complex portfolios',
    monthlyPrice: 999,
    yearlyPrice: 833,
    features: [
      'Unlimited repositories',
      'Unlimited analyses',
      'Multi-portfolio management',
      'Custom playbooks',
      'White-glove onboarding',
      'SSO/SAML integration',
      'Dedicated support engineer',
      'SLA guarantee',
    ],
    limits: {
      repositories: 'Unlimited',
      analysesPerMonth: 'Unlimited',
      playbooks: 'Custom',
      teamMembers: 'Unlimited',
      support: 'Dedicated',
    },
    cta: 'Contact Sales',
  },
];

const comparisonFeatures = [
  { name: 'Repositories', starter: '3', professional: '25', enterprise: 'Unlimited' },
  { name: 'Monthly Analyses', starter: '5', professional: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Team Members', starter: '1', professional: '10', enterprise: 'Unlimited' },
  { name: 'Security Scanning', starter: true, professional: true, enterprise: true },
  { name: 'Vulnerability Detection', starter: 'Basic', professional: 'Full', enterprise: 'Full' },
  { name: 'Technical Debt Analysis', starter: true, professional: true, enterprise: true },
  { name: 'Dead Code Detection', starter: false, professional: true, enterprise: true },
  { name: 'Architecture Review', starter: false, professional: true, enterprise: true },
  { name: 'Transformation Execution', starter: false, professional: true, enterprise: true },
  { name: 'Custom Playbooks', starter: false, professional: false, enterprise: true },
  { name: 'API Access', starter: false, professional: true, enterprise: true },
  { name: 'SSO/SAML', starter: false, professional: false, enterprise: true },
  { name: 'Multi-Portfolio View', starter: false, professional: false, enterprise: true },
  { name: 'Audit Logs', starter: false, professional: true, enterprise: true },
  { name: 'SLA Guarantee', starter: false, professional: false, enterprise: true },
];

const faqs = [
  {
    question: 'What counts as a repository?',
    answer: 'A repository is any Git repository connected to CodeForge, regardless of size or hosting platform (GitHub, GitLab, Bitbucket, etc.).',
  },
  {
    question: 'Can I upgrade or downgrade at any time?',
    answer: 'Yes! You can upgrade immediately and the difference will be prorated. Downgrades take effect at the end of your billing cycle.',
  },
  {
    question: 'What happens when I hit my analysis limit?',
    answer: 'You\'ll receive a notification before reaching your limit. You can purchase additional analyses or upgrade your plan.',
  },
  {
    question: 'Do you offer discounts for startups or nonprofits?',
    answer: 'Yes! We offer 50% off for qualified startups (under $5M funding) and nonprofits. Contact us to apply.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, ACH transfers, and wire transfers for Enterprise plans. Invoicing available for annual plans.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! All paid plans include a 14-day free trial with full access to features. No credit card required to start.',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const theme = useTheme();
  const [isYearly, setIsYearly] = useState(true);

  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.name === 'Enterprise') {
      // In production, this would open a contact form or Calendly
      window.location.href = 'mailto:sales@codeforge.ai?subject=Enterprise Plan Inquiry';
    } else {
      router.push('/codeforge/onboarding');
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            Start free, scale as you grow. Cancel anytime.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography color={!isYearly ? 'primary' : 'text.secondary'}>Monthly</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isYearly}
                  onChange={(e) => setIsYearly(e.target.checked)}
                  color="primary"
                />
              }
              label=""
            />
            <Typography color={isYearly ? 'primary' : 'text.secondary'}>
              Yearly
              <Chip
                label="Save 20%"
                size="small"
                color="success"
                sx={{ ml: 1 }}
              />
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Pricing Cards */}
      <Container maxWidth="lg" sx={{ py: 6, mt: -8 }}>
        <Grid container spacing={4} alignItems="stretch">
          {pricingTiers.map((tier) => (
            <Grid item xs={12} md={4} key={tier.name}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: tier.popular ? `2px solid ${theme.palette.primary.main}` : undefined,
                  boxShadow: tier.popular ? 8 : 2,
                }}
              >
                {tier.popular && (
                  <Chip
                    icon={<StarIcon />}
                    label="Most Popular"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, pt: tier.popular ? 4 : 3 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {tier.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 48 }}>
                    {tier.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" component="span" fontWeight="bold">
                      ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                    </Typography>
                    <Typography variant="body2" component="span" color="text.secondary">
                      /month
                    </Typography>
                    {isYearly && tier.monthlyPrice > 0 && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        Billed annually (${tier.yearlyPrice * 12}/year)
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <List dense>
                    {tier.features.map((feature, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant={tier.popular ? 'contained' : 'outlined'}
                    size="large"
                    onClick={() => handleSelectPlan(tier)}
                  >
                    {tier.cta}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Feature Comparison Table */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Compare Plans
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            Find the right plan for your needs
          </Typography>

          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Feature</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Starter</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'white' }}>
                    Professional
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Enterprise</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparisonFeatures.map((feature) => (
                  <TableRow key={feature.name} hover>
                    <TableCell>{feature.name}</TableCell>
                    <TableCell align="center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CloseIcon color="disabled" />
                        )
                      ) : (
                        feature.starter
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ bgcolor: 'primary.50' }}>
                      {typeof feature.professional === 'boolean' ? (
                        feature.professional ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CloseIcon color="disabled" />
                        )
                      ) : (
                        feature.professional
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CloseIcon color="disabled" />
                        )
                      ) : (
                        feature.enterprise
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
          Have more questions? Contact us at support@codeforge.ai
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="medium">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to transform your codebase?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
            Start with a free assessment. No credit card required.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            onClick={() => router.push('/codeforge/onboarding')}
          >
            Start Free Trial
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
