import React, { useState, useEffect } from 'react';
import { CardMedia, CircularProgress, Box } from '@mui/material';
import { CardMediaProps } from '@mui/material/CardMedia';

import { motion } from 'framer-motion';

type LoadingCardMediaProps = CardMediaProps & {
  image: string;
  alt?: string;
  sx?: React.CSSProperties;
};

const LoadingCardMedia: React.FC<LoadingCardMediaProps> = ({
  image,
  alt,
  sx,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setLoaded(true);
  }, [image]);

  return (
    <Box position="relative" width="100%">
      {!loaded && (
        <Box
          sx={{
            width: '100%',
            aspectRatio: '1/1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {loaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardMedia
            component="img"
            image={image}
            alt={alt}
            style={{
              width: '100%',
              position: 'relative',
            }}
            sx={{
              ...sx,
            }}
            onLoad={() => setLoaded(true)}
            {...props}
          />
        </motion.div>
      )}
    </Box>
  );
};

export default LoadingCardMedia;
