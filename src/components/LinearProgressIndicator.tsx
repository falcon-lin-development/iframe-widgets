// components/LinearProgressIndicator.tsx
import { Box } from '@mui/material';
import React, { useState, useEffect } from 'react';

type LinearProgressIndicatorProps = {
  progress: number; // Progress as a percentage (0 to 100)
};

const LinearProgressIndicator: React.FC<LinearProgressIndicatorProps> = ({
  progress,
}) => {
  // Clamp the progress to be between 0 and 100
  const actualProgress = Math.min(100, Math.max(0, progress));

  return (
    <>
      {/* Use flex to display items inline and space-x-4 for spacing between */}
      <Box className="tw-flex tw-items-center tw-space-x-[16px]">
        <Box
          className="tw-w-full tw-bg-neutralSwatch-95"
          sx={{
            borderRadius: '9999px',
          }}
        >
          <Box
            className="tw-bg-primarySwatch-40 tw-h-1"
            style={{ width: `${actualProgress}%` }}
            sx={{
              borderRadius: '9999px',
            }}
          ></Box>
        </Box>
        {/* Add a span to show the progress percentage */}
        {/* <span className="tw-whitespace-nowrap body-small tw-text-neutralSwatch-50">
          {actualProgress}%
        </span> */}
      </Box>
    </>
  );
};

export default LinearProgressIndicator;
