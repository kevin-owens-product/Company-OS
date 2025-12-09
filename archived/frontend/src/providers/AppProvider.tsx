import React from 'react';
import { CssBaseline } from '@mui/material';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
}; 