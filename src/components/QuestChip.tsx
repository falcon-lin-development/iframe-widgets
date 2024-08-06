import { Chip, capitalize } from '@mui/material';
import colors from '@/styles/colors.config';

export const QuestChip: React.FC<{ text: string }> = ({ text }) => {
  return (
    <Chip
      className="tw-font-inter"
      label={
        capitalize(text)
        // text.toLowerCase()
      }
      sx={{
        backgroundColor: colors.primarySwatch.main[90],
        color: colors.primarySwatch.main[10],
        borderRadius: '100rem',
        height: 'auto',
        '& .MuiChip-label': {
          padding: '4px 8px',
          fontFamily: 'Neue Metana, sans-serif',
          fontSize: '12px',
          fontStyle: 'normal',
          fontWeight: '400',
          lineHeight: '16px',
          letterSpacing: '0.1px',
        },
      }}
    />
  );
};
