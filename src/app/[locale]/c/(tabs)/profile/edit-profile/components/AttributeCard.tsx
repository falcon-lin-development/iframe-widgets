import { PiIcon } from 'lucide-react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Snackbar,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import colors from '@/styles/colors.config';
import { BadgeHolding } from '@/data/graphql/models/PersonaAttributeBadges';
import { DEFAULT_BADGE_BG } from '@/styles/bgOptions/BadgeBGOptions';

const AttributeCard: React.FC<{
  attributeBadge: BadgeHolding;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}> = ({ sx, onClick, attributeBadge, children }) => {
  const widgetWidth = 74;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${widgetWidth}px`,
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
      <Box
        className="attr-icon"
        sx={{
          background: colors.primarySwatch.main[98],
          borderRadius: '9999px',
          width: `${widgetWidth}px`,
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Avatar
          src={attributeBadge.badgeMetadata.thumbnail_url}
          sx={{
            width: '100%',
            height: '100%',
            aspectRatio: '1/1',
            background: DEFAULT_BADGE_BG,
          }}
        />
      </Box>
      <Box sx={{ paddingTop: '4px' }} aria-label="spacer" />
      <Typography
        variant="labelSmall"
        color={colors.white}
        fontFamily={'Neue Metana'}
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {attributeBadge.badgeMetadata.display_name}
      </Typography>
    </Box>
  );
};

export default AttributeCard;
