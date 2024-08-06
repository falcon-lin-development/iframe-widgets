import { DEFAULT_BADGE_BG } from '@/styles/bgOptions/BadgeBGOptions';

import colors from '@/styles/colors.config';
import { Box, IconButton, Typography } from '@mui/material';
import { XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const MotionBox = motion(Box);
const AnimatedBox = ({
  isVisible,
  children,
  sx,
}: {
  isVisible: boolean;
  children: React.ReactNode;
  sx?: any;
}) => (
  <AnimatePresence>
    {isVisible && (
      <MotionBox
        key="animated-box"
        initial={{ opacity: 0, x: '-50%', y: -100 }}
        animate={{ opacity: 1, x: '-50%', y: 0 }}
        exit={{ opacity: 0, x: '-50%', y: -100 }}
        transition={{ duration: 0.2 }}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primarySwatch.main[98],
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.35)',
          padding: '12px 16px',
          borderRadius: '8px',
          ...sx,
        }}
      >
        {children}
      </MotionBox>
    )}
  </AnimatePresence>
);

const NotificationPopUp: React.FC<{
  image: string;
  content: string;
  open: boolean;
  onClose: () => void;
  sx?: any;
}> = ({ image, content, sx, onClose, open }) => {
  return (
    <AnimatedBox isVisible={open} sx={sx}>
      <Image
        src={image}
        alt={image}
        width={108}
        height={108}
        style={{
          borderRadius: '9999px',
          background: DEFAULT_BADGE_BG,
          aspectRatio: '1/1',
          objectFit: 'contain',
          height: '56px',
        }}
      />
      <Box paddingRight={'8px'} aria-label="spacer" />
      <Typography
        variant="titleSmall"
        sx={{
          textAlign: 'left',
          // fontFamily: 'Basier Circle',
          color: colors.neutralSwatch.main[30],
        }}
      >
        {content}
      </Typography>
      <Box paddingRight={'8px'} aria-label="spacer" />

      <IconButton
        onClick={() => {
          onClose && onClose();
        }}
        sx={{
          color: colors.primarySwatch.main[40],
          padding: 0,
          '&:hover': {
            color: colors.primarySwatch.main[40],
          },
        }}
      >
        <XCircle size={24} />
      </IconButton>
    </AnimatedBox>
  );
};

export default NotificationPopUp;
