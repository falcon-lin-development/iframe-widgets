'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { IconButton } from '@mui/material';
type Props = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  sx?: React.CSSProperties;
};

const BackArrowSVG = '/icons/back-arrow.svg';
const BackIconButton: React.FC<Props> = ({ onClick, sx, disabled }) => {
  const router = useRouter();

  const handleBackClick: React.MouseEventHandler<HTMLButtonElement> = onClick
    ? onClick
    : (e) => {
        router.back();
      };

  return (
    <IconButton
      onClick={handleBackClick}
      aria-label="Go back"
      sx={sx}
      style={
        {
          // height: 24, width: 24
        }
      }
      disabled={disabled}
    >
      <ChevronLeft size={24} />
    </IconButton>
  );
};

export default BackIconButton;
