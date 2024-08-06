// src/components/Scaffold.tsx
import { Box, SxProps, Theme } from '@mui/material';
import React, { ReactNode } from 'react';
import colors from '@/styles/colors.config';

type Props = {
  appbar?: ReactNode;
  mainBody: ReactNode;
  bottomNavbar?: ReactNode;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
  botMaxWidth?: string;
  stickyAppbar?: boolean;
  className?: string;
};

const Scaffold: React.FC<Props> = ({
  appbar,
  mainBody,
  bottomNavbar,
  className = '',
  style = {},
  sx = {},
  stickyAppbar = true,
  botMaxWidth,
}) => {
  return (
    <Box
      id="scaffold"
      className={`tw-flex tw-flex-col tw-h-full  ${className}`}
      style={{
        minHeight: '100vh',
        ...style,
        // minHeight: '-webkit-fill-available',
      }}
      sx={sx}
    >
      {appbar && (
        <header
          style={{
            position: stickyAppbar ? 'sticky' : 'relative',
            top: 0,
            zIndex: 10,
            backgroundColor: colors.primarySwatch.main[98],
          }}
          className={` tw-z-10 `}
        >
          {appbar}
        </header>
      )}
      <main className="tw-flex-grow tw-overflow-y-visible tw-relative ">
        {/* Ensuring mainBody has the necessary styles to be scrollable */}
        {mainBody}
      </main>
      {bottomNavbar && (
        <footer
          style={{
            position: 'fixed',
            bottom: 0,
            // maxWidth: ,
            width: '100%',
            zIndex: 10,
            borderRadius: '8px 8px 0px 0px',
            backgroundColor: colors.primarySwatch.main[98],
            // maxWidth: `${botMaxWidth} !important` || '100%',
          }}
          className={!botMaxWidth ? `tw-max-w-mobile` : ''}
        >
          {bottomNavbar}
        </footer>
      )}
    </Box>
  );
};

export default Scaffold;
