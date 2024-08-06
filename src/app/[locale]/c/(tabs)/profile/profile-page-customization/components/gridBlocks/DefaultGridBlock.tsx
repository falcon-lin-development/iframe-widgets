/**
 * Default GridBlock Inner
 */

import { Box } from '@mui/material';

export const DefaultGridBlock: React.FC<{
  id: string;
}> = ({ id }) => {
  return (
    <Box
      sx={{
        padding: '10px',
        height: '100%',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          textAlign: 'center',
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          border: '1px solid black',
          // clipPath: "url(#SquircleClip-1)",
        }}
        style={{
          cursor: 'move',
          height: '100%',
          color: 'black',
        }}
      >
        {id}
      </Box>
    </Box>
  );
};
