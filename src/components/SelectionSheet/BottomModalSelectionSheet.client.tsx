'use client';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import colors from '@/styles/colors.config';
import Sheet from 'react-modal-sheet';
import { Box, Button, SxProps, Theme, Typography } from '@mui/material';

export type SelectionOption = {
  title: string;
  icon?: React.ElementType;
  targetUrl?: string;
  targetValue?: any;
  sx?: SxProps<Theme>;
  [key: string]: any;
};

export type ModalSheetSelectionInfo = {
  title?: string;
  options: SelectionOption[];
};

export const SectionsBottomModalSheet: React.FC<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  setSelectedValue: (value: any) => void;
  info: ModalSheetSelectionInfo;
}> = ({ isOpen, setOpen, setSelectedValue, info }) => {
  const { constructPath } = useAppRouting();
  return (
    <Sheet
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      detent="content-height"
      style={{
        color: colors.neutralSwatch.main[30],
      }}
    >
      <Sheet.Container>
        {/* <Sheet.Header /> */}
        <Sheet.Content
          style={{
            padding: '12px 12px 12px 12px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <>
            {info.title && (
              <>
                <Typography
                  variant="titleMedium"
                  component={'h2'}
                  sx={{
                    textAlign: 'left',
                  }}
                >
                  {info.title}
                </Typography>
                <Box
                  sx={{
                    paddingTop: '8px',
                  }}
                  aria-label="spacer"
                />
              </>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column', // column
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                width: '100%',
                gap: '4px',
              }}
            >
              {info.options.map((option, index) => {
                return (
                  <Button
                    contextMenu="a"
                    href={
                      option.targetUrl ? constructPath(option.targetUrl) : ''
                    }
                    key={index}
                    fullWidth
                    startIcon={
                      option.icon && (
                        <option.icon
                        // color={colors.neutralSwatch.main[30]}
                        />
                      )
                    }
                    onClick={() => {
                      setSelectedValue(option.targetValue || index);
                      setOpen(false);
                    }}
                    sx={{
                      borderRadius: '0',
                      padding: '12px 14px',
                      justifyContent: 'flex-start',

                      '& .MuiTouchRipple-root': {
                        borderRadius: '0',
                      },
                      '& .MuiButton-startIcon': {
                        marginRight: '24px',
                      },
                      color: colors.neutralSwatch.main[40],
                      ...option.sx,
                    }}
                  >
                    <Typography
                      variant="bodyLarge"
                      sx={{
                        fontFamily: 'Basier Circle',
                        textAlign: 'left',
                      }}
                    >
                      {option.title}
                    </Typography>
                  </Button>
                );
              })}
            </Box>
          </>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        onTap={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
      />
    </Sheet>
  );
};
