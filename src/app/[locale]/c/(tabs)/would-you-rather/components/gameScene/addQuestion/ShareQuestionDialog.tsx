'use client';
import React, { use, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContentText,
  DialogTitle,
  Typography,
  DialogContent,
  IconButton,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';

// components
import { LucideMessageCircleQuestion, X } from 'lucide-react';
import DefaultPickerDisplay from '../../pickers/DefaultPicker.display';
import { shareOrCopy } from '@/components/buttons/ShareButton.client';

// constants
import { ButtonID } from '@/constants';
import colors from '@/styles/colors.config';

// hooks
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useCreateWyrPost } from '../../../graphql/createWyrPostContextProvider';
import { GAMESTATE, usePageState } from '../../../pageStateContextProvider';
import MaxLineTypography from '@/components/MaxLineTypography';

const ShareQuestionDialog: React.FC<{
  open: boolean;
  onClose: (action: boolean, data?: Record<string, any>) => void; // Function to call with the action result
}> = ({ open, onClose }) => {
  const [snackbarIsOpen, setSnackbarIsOpen] = React.useState(false);
  const { logButtonClick } = useLogEvent();
  // create post context hook
  const { createWyrPostState } = useCreateWyrPost();

  const questionId = useMemo(() => {
    return createWyrPostState.data?.createWyrPost?.reference?.post_id;
  }, [createWyrPostState]);

  const url = useMemo(
    () => window.location.origin + window.location.pathname + `/${questionId}`,
    [questionId],
  );

  return (
    <Dialog
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          // padding: '12px 24px',
          height: '100vh',
          width: '430px', // dialog has a max-width of vw - margin
        },
      }}
      //   fullScreen
    >
      <>
        <Box sx={{ paddingTop: '8px' }} aria-label="spacer" />
        <Box sx={{ textAlign: 'right', paddingX: '8px' }}>
          <IconButton
            onClick={() => {
              onClose(true);
            }}
          >
            <X />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            paddingX: '24px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <LucideMessageCircleQuestion
              size={18}
              style={{
                minWidth: '18px',
                color: colors.primarySwatch.lavender.primary,
              }}
            />
            <Box sx={{ paddingRight: '8px' }} aria-label="spacer" />
            <MaxLineTypography
              variant="titleSmall"
              sx={{
                maxWidth: 'calc(100%)',
                '& .MuiTypography-root': {
                  transform: 'translateY(2px)',
                  textAlign: 'left',
                },
              }}
            >
              {createWyrPostState.data?.createWyrPost.reference.post_content_map
                ?.caption || 'Would you rather..'}
            </MaxLineTypography>
          </Box>
          <Box sx={{ paddingTop: '8px' }} aria-label="spacer" />
          <DefaultPickerDisplay
            wyrPostReference={createWyrPostState.data?.createWyrPost.reference}
          />
          <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
          <Typography variant="titleMedium">
            See How Your Friends’ Pick
          </Typography>
          <Box sx={{ paddingTop: '8px' }} aria-label="spacer" />

          <Typography
            variant="bodyLarge"
            sx={{
              fontFamily: 'Basier Circle',
              color: colors.neutralSwatch.main[30],
            }}
          >
            Your question has been created successfully! Get vote from your
            loves now!
          </Typography>
          <Box sx={{ paddingTop: '24px' }} aria-label="spacer" />

          <Button
            variant="contained"
            fullWidth
            onClick={() =>
              shareOrCopy({
                logButtonClick,
                url,
                copiedCallback: () => {
                  setSnackbarIsOpen(true);
                },
              })
            }
          >
            <Typography variant="labelLarge">Share to Friends</Typography>
          </Button>
          <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />

          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              onClose(true);
            }}
            sx={{
              color: colors.primarySwatch.lavender[40],
            }}
          >
            <Typography variant="labelLarge">Share Later</Typography>
          </Button>
          <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
        </Box>

        <Snackbar
          open={snackbarIsOpen}
          sx={{}}
          autoHideDuration={6000}
          onClose={() => setSnackbarIsOpen(false)}
          message="Copied to clipboard"
        />
      </>
    </Dialog>
  );
};

export default ShareQuestionDialog;
