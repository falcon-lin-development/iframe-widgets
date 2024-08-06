import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Link from 'next/link';

import colors from '@/styles/colors.config';
import routes from '@/routes/routes';

// Function to determine if the button should be active based on some condition
type NavBarIconButtonProps = {
  id?: string;
  name: string;
  icon: React.ReactNode;
  focusIcon: React.ReactNode;
  active: boolean;
  onClick?: () => void;
  href: string;
  showText?: boolean;
};
export const NavBarIconButton: React.FC<NavBarIconButtonProps> = ({
  id,
  name,
  icon,
  focusIcon,
  active,
  onClick,
  href,
  showText = true,
}) => {
  return (
    <>
      <Link id={id} data-gtm={id} href={href} prefetch={true}>
        <Button
          startIcon={active ? focusIcon : icon}
          onClick={onClick}
          sx={{
            // this one is for normal display
            fontSize: '12px',
            flexDirection: 'column',
            color: active
              ? colors.neutralSwatch.main[10]
              : colors.neutralSwatch.main[50],
            padding: '0px',
            '& .MuiButton-startIcon': {
              // for the icon
              backgroundColor: active
                ? colors.primarySwatch.main[90]
                : 'transparent',
              margin: '0',
              paddingY: '0px',
              paddingX: '10px',
              padding: href === routes.c.profile._home ? '2px' : null,
              borderRadius: '9999px',
            },
            '& .MuiTouchRipple-root': {
              // for the ripple
              // borderRadius: '9999px',
              color: colors.primarySwatch.main[90],
            },
            '&:hover': {
              // for on-click / hover
              color: active
                ? colors.neutralSwatch.main[10]
                : colors.neutralSwatch.main[50],
            },
          }}
        >
          {showText && (
            <Typography
              variant="labelMedium"
              sx={{
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {name}
            </Typography>
          )}
        </Button>
      </Link>
    </>
  );
};

type Props = {
  children: React.ReactNode; // Accept any valid React Node
  sx?: React.CSSProperties;
};

const BottomNavbar: React.FC<Props> = ({ children, sx }) => {
  return (
    <>
      {/* <Box sx={{ paddingTop: '16px' }} /> */}
      <footer
        style={{
          boxShadow: '0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px 8px 0px 0px',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          padding: '0px 16px',
          height: '56px',
          // height: '52px',
          ...sx,
        }}
      >
        <div className="tw-flex tw-flex-grow tw-justify-evenly">{children}</div>
      </footer>
    </>
  );
};

export default BottomNavbar;
