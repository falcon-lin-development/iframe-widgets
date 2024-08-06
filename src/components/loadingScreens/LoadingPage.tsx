'use client';
// import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

// constants
import Scaffold from '../scaffolds/Scaffold';
import MainBody from '../MainBody';
import colors from '@/styles/colors.config';

type Props = {
  loadingText?: string;
};

const LoadingPage: React.FC<Props> = ({ loadingText = '' }) => {
  // return <LoadingSkeleton />;
  return (
    <>
      <Scaffold
        mainBody={
          <MainBody
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
            {/* show loading text if development env */}
            {process.env.NODE_ENV === 'development' && loadingText && (
              <Box color={colors.primarySwatch.main[10]} paddingTop={'16px'}>
                <Typography>{loadingText}</Typography>
              </Box>
            )}
          </MainBody>
        }
      />
    </>
  );
};

export default LoadingPage;
