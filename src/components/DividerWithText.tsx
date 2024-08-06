import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { SxProps, Theme } from '@mui/material';

const DividerWithText: React.FC<{
  text: string;
  sx?: SxProps<Theme>;
}> = ({ text, sx = {} }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        my: 2,
        ...sx,
      }}
    >
      <Divider sx={{ flexGrow: 1 }} />
      <span className="body-small tw-text-neutralSwatch-50 tw-px-[1rem]">
        {text}
      </span>
      <Divider sx={{ flexGrow: 1 }} />
    </Box>
  );
};

export default DividerWithText;
