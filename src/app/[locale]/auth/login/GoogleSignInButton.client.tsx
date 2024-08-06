'use client';
// GoogleSignInButton.tsx
import React from 'react';
import Button from '@mui/material/Button';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import colors from '@/styles/colors.config';

import Image from 'next/image';
import routes from '@/routes/routes';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import assets, { ButtonID } from '@/constants';
import { Typography } from '@mui/material';

interface GoogleSignInButtonProps {
  nexturl?: string | undefined;
  loginurl?: string | undefined;
}

const GoogleIcon: React.FC = () => {
  return (
    <Image
      src={assets.icons.google}
      height={18}
      width={18}
      alt="google-icon"
    ></Image>
  );
};
const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  nexturl,
  loginurl,
}) => {
  const {
    utils: { dgSignInGoogle },
  } = useDGAuth();

  const { logButtonClick } = useLogEvent();

  const onClick = async () => {
    logButtonClick(ButtonID.googleLogin, '');
    dgSignInGoogle(
      JSON.stringify({
        nexturl,
        loginurl,
      }),
    );
  };

  return (
    <Button
      id={ButtonID.googleLogin}
      variant="contained"
      startIcon={<GoogleIcon />}
      onClick={onClick}
      fullWidth
      sx={{
        backgroundColor: colors.primarySwatch.main[90], // Google's brand color
        textTransform: 'none',
        borderRadius: '9999rem',
        boxShadow: 'none',
        padding: '0.5rem 0',
        '&:hover': {
          backgroundColor: colors.primarySwatch.main[80],
        },
      }}
    >
      <Typography
        variant="labelLarge"
        sx={{
          color: colors.secondarySwatch.main[10],
          transform: 'translateY(2px)',
        }}
      >
        Continue with Google
      </Typography>
    </Button>
  );
};

export default GoogleSignInButton;
