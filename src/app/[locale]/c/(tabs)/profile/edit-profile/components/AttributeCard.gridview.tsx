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

const AttributeCardGridView: React.FC<{
  attributeBadge: BadgeHolding;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}> = ({ sx, onClick, attributeBadge, children }) => {
  //   const widgetWidth = 74;

  return (
    <Box
      className="attr-icon"
      sx={{
        //   width: `${widgetWidth}px`,
        background: colors.primarySwatch.main[98],
        borderRadius: '9999px',
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        ...sx,
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
  );
};

export default AttributeCardGridView;
