import colors from '@/styles/colors.config';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';

const TutorialBubble: React.FC<{
  image: string;
  title: string;
  content: string;
  sx?: any;
}> = ({ image, title, content, sx }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primarySwatch.main[95],
        gap: '8px',
        ...sx,
      }}
    >
      <Image
        src={image}
        alt={title}
        width={56}
        height={56}
        style={{
          borderRadius: '8px',
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="titleSmall"
          sx={{ textAlign: 'left', color: colors.neutralSwatch.main[10] }}
        >
          {title}
        </Typography>
        <Typography
          variant="bodyMedium"
          sx={{
            textAlign: 'left',
            fontFamily: 'Basier Circle',
            color: colors.neutralSwatch.main[30],
          }}
        >
          {content}
        </Typography>
      </Box>
    </Box>
  );
};

export default TutorialBubble;
