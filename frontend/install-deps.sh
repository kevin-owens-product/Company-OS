#!/bin/bash

# Install dependencies
npm install

# Install additional type definitions
npm install --save-dev @types/react @types/react-dom @types/node

# Install Material-UI dependencies
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Install authentication dependencies
npm install next-auth

# Install data fetching dependencies
npm install @tanstack/react-query

# Install internationalization dependencies
npm install i18next react-i18next

# Install form handling dependencies
npm install react-hook-form zod

# Install API client
npm install axios

# Install Stripe
npm install @stripe/stripe-js 