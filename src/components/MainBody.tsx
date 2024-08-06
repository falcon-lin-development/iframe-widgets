// src/components/MainBody.tsx
import React, { ReactNode } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
type Props = {
  children: ReactNode;
  className?: string;
  bgColor?: string;
  bottomPadding?: boolean;
  style?: React.CSSProperties;
  sx?: SxProps<Theme> | undefined;
  customRef?: React.RefObject<HTMLDivElement>;
};

const MainBody: React.FC<Props> = ({
  children,
  className = '',
  bgColor = 'tw-bg-white',
  style = {},
  sx = {},
  bottomPadding = true,
  customRef,
}) => {
  return (
    <>
      <Box
        ref={customRef}
        style={{
          minHeight: '100vh', // this make sure the main page take at least the height of the screen
          ...style,
        }}
        className={`tw-flex tw-flex-col tw-justify-start tw-items-center ${bgColor}  ${className}`}
        sx={sx}
      >
        {children}
        {bottomPadding && (
          <div
            className="tw-pt-[46px]"
            aria-label="spacer"
            aria-hidden="true"
          />
        )}
      </Box>
    </>
  );
};

export default MainBody;
