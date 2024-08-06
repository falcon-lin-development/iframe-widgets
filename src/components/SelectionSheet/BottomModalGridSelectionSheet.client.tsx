'use client';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import colors from '@/styles/colors.config';
import Sheet from 'react-modal-sheet';
import {
  Box,
  Button,
  Grid,
  IconButton,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { X } from 'lucide-react';

export type GridSelectionOption = {
  label?: string;
  value: string | number;
  displayItem: React.ReactNode;
  sx?: SxProps<Theme>;
  [key: string]: any;
};

export type BottomModalGridSelectionSheetInfo = {
  title?: string;
  subtitle?: string;
  options: GridSelectionOption[];
  defaultIndex?: number;
};

export const BottomModalGridSelectionSheet: React.FC<{
  open: boolean;
  onClose: () => void;
  onSelect: (value: string | number) => void;
  selectionInfo: BottomModalGridSelectionSheetInfo;
}> = ({ open, onClose, onSelect, selectionInfo }) => {
  const { constructPath } = useAppRouting();
  return (
    <Sheet
      isOpen={open}
      onClose={onClose}
      detent="full-height"
      style={{
        color: colors.neutralSwatch.main[30],
      }}
    >
      <Sheet.Container
        style={{
          overflow: 'auto',
        }}
      >
        {/* <Sheet.Header /> */}
        {selectionInfo.title && (
          <SheetTopBar selectionInfo={selectionInfo} onClose={onClose} />
        )}
        {selectionInfo.subtitle && (
          <>
            <Box
              sx={{
                padding: '16px',
              }}
            >
              <Typography
                variant="bodyLarge"
                color={colors.neutralSwatch.main[30]}
                fontFamily={'Basier Circle'}
              >
                {selectionInfo.subtitle}
              </Typography>
            </Box>
          </>
        )}
        <Sheet.Content
          style={{
            padding: '0px 12px',
          }}
        >
          <>
            <Grid container spacing={2}>
              {Array.from(selectionInfo.options).map((option, index) => (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  lg={2}
                  key={index}
                  onClick={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                >
                  <Box
                    sx={{
                      aspectRatio: '1/1',
                      position: 'relative',
                      textAlign: 'center',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    {option.displayItem}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
          <Box padding="16px" aria-label="spacer" />
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        onTap={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
    </Sheet>
  );
};

// Other Components
const SheetTopBar: React.FC<{
  selectionInfo: BottomModalGridSelectionSheetInfo;
  onClose?: () => void;
}> = ({ selectionInfo, onClose }) => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: colors.primarySwatch.main[98],
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderRadius: '8px 8px 0px 0px',
          minHeight: '56px',
          paddingX: '12px',
        }}
      >
        {onClose && (
          <IconButton
            onClick={() => {
              onClose();
            }}
          >
            <X />
          </IconButton>
        )}
        <Typography variant="titleMedium" component={'h2'}>
          {selectionInfo.title}
        </Typography>
      </Box>
    </>
  );
};
