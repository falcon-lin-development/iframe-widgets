/**
 * Tool Bars
 */

import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

export const TopToolBar: React.FC<{
  isToolBoxOpen: boolean;
}> = ({ isToolBoxOpen }) => {
  return (
    <>
      {isToolBoxOpen && (
        <Box
          component={motion.div}
          // show toolbar from bottom up
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            // height: '10%', // Adjust as needed
            height: 56, // Adjust as needed
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Add your toolbar content here */}
          <Typography>Editing Toolbar</Typography>
        </Box>
      )}
    </>
  );
};
