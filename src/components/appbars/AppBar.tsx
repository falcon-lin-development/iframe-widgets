// components/AppBar.tsx
'use client';
// "use server"
import React, { useEffect, useMemo, useState } from 'react';
import colors from '@/styles/colors.config';
import { Box, SxProps, Theme, Typography } from '@mui/material';

type AppBarProps = {
  title?: string | React.ReactNode;
  // smallerHeaderTitle?: string;
  // titleNode?: React.ReactNode;
  backButton?: React.ReactNode;
  mainIcon?: React.ReactNode;
  // inboxIcon?: React.ReactNode;
  rightMostIcon?: React.ReactNode;
  progressIndicator?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
};

const AppBar: React.FC<AppBarProps> = ({
  title,
  // smallerHeaderTitle
  mainIcon,
  backButton,
  // inboxIcon,
  rightMostIcon,
  progressIndicator,
  style = {},
  className,
  sx = {},
}) => {
  return (
    <>
      <Box
        component={'header'}
        className={`tw-w-full ${className}`}
        style={{
          ...style,
        }}
        sx={sx}
      >
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          className="tw-text-appbarTitle tw-items-center tw-px-4 tw-py-1.5"
        >
          <Box
            display={'flex'}
            flexDirection={'row'}
            sx={{
              alignItems: 'center',
            }}
          >
            {backButton}
            {mainIcon}
            {(backButton || mainIcon) && (
              <div className="tw-pr-[8px]" aria-hidden="true"></div>
            )}
            {title && (
              <Typography
                variant="titleMedium"
                className="tw-flex-grow tw-text-left tw-whitespace-nowrap"
                sx={{
                  transform: 'translateY(2px)',
                  textAlign: 'left',
                }}
              >
                {title}
              </Typography>
            )}
          </Box>
          <Box
            display={'flex'}
            flexDirection={'row'}
            // sx={{
            //   alignItems: 'center',
            //   gap:"14px"
            // }}
          >
            {/* {inboxIcon} */}
            {/* {rightMostIcon && (
              <div className="tw-pr-[14px]" aria-hidden="true"></div>
            )} */}
            {rightMostIcon}
          </Box>
        </Box>
        {progressIndicator && (
          <>
            <Box
              className="tw-w-full tw-px-[24px]"
              sx={{
                paddingTop: '8px',
                paddingBottom: '16px',
              }}
            >
              {' '}
              {/* p-4 is a utility class for padding */}
              {progressIndicator}
            </Box>
            {/* <div className="tw-w-full tw-h-4" aria-hidden="true"></div> */}
          </>
        )}
      </Box>
    </>
  );
};

export default AppBar;
