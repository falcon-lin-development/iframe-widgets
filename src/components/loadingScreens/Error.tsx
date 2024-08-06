import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const ErrorPage: React.FC<{
  error?: string;
}> = ({ error = 'some error' }) => {
  // You can add any UI inside Loading, including a Skeleton.s
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'red',
      }}
    >
      <h1>{error}</h1>
    </Box>
  );
};

export default ErrorPage;
