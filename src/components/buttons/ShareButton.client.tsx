'use client';
import { ButtonID } from '@/constants';
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  SxProps,
  Theme,
} from '@mui/material';
import { Share2 } from 'lucide-react';
import React from 'react';

type ShareOrCopyProps = {
  logButtonClick: (buttonId: any, data: string) => void;
  sharedCallback?: () => void;
  copiedCallback?: () => void;
  url: string;
  title?: string;
  text?: string;
};
export const shareOrCopy = ({
  logButtonClick,
  sharedCallback,
  copiedCallback,
  url,
  title = 'Would you rather?',
  text = 'Try this question',
}: ShareOrCopyProps) => {
  logButtonClick(ButtonID.functions.share_url, url);
  if (navigator.share) {
    navigator
      .share({
        title: title,
        text: text,
        url: url,
      })
      // .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing:', error))
      .finally(() => {
        if (sharedCallback) sharedCallback();
      });
  } else {
    navigator.clipboard
      .writeText(url)
      // .then(() => console.log('Successful copy'))
      .catch((error) => console.log('Error copying:', error))
      .finally(() => {
        if (copiedCallback) copiedCallback();
      });
  }
};

const ShareButton: React.FC<{
  shareProps: ShareOrCopyProps;
  sx?: SxProps<Theme>;
}> = ({ sx, shareProps }) => {
  const [copySnackBarIsOption, setCopySnackBarIsOpen] = React.useState(false);
  const [sharedSnackBarIsOpen, setSharedSnackBarIsOpen] = React.useState(false);

  return (
    <>
      <IconButton
        onClick={() => {
          shareOrCopy({
            ...shareProps,
            sharedCallback: () => {
              setSharedSnackBarIsOpen(true);
              shareProps.sharedCallback && shareProps.sharedCallback();
            },
            copiedCallback: () => {
              setCopySnackBarIsOpen(true);
              shareProps.copiedCallback && shareProps.copiedCallback();
            },
          });
        }}
        sx={sx}
      >
        <Share2 size={18} />
      </IconButton>
      <Snackbar
        open={copySnackBarIsOption}
        sx={{}}
        autoHideDuration={6000}
        onClose={() => setCopySnackBarIsOpen(false)}
        message="Copied to clipboard"
      />
      <Snackbar
        open={sharedSnackBarIsOpen}
        sx={{}}
        autoHideDuration={6000}
        onClose={() => setSharedSnackBarIsOpen(false)}
        message="Shared Post"
      />
    </>
  );
};

export const SharableButton: React.FC<{
  shareProps: ShareOrCopyProps;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}> = ({ sx, shareProps, children }) => {
  const [copySnackBarIsOption, setCopySnackBarIsOpen] = React.useState(false);
  const [sharedSnackBarIsOpen, setSharedSnackBarIsOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => {
          shareOrCopy({
            ...shareProps,
            sharedCallback: () => {
              setSharedSnackBarIsOpen(true);
              shareProps.sharedCallback && shareProps.sharedCallback();
            },
            copiedCallback: () => {
              setCopySnackBarIsOpen(true);
              shareProps.copiedCallback && shareProps.copiedCallback();
            },
          });
        }}
        sx={sx}
      >
        {children}
      </Button>
      <Snackbar
        open={copySnackBarIsOption}
        sx={{}}
        autoHideDuration={6000}
        onClose={() => setCopySnackBarIsOpen(false)}
        message="Share link copied!"
      />
      <Snackbar
        open={sharedSnackBarIsOpen}
        sx={{}}
        autoHideDuration={6000}
        onClose={() => setSharedSnackBarIsOpen(false)}
        message="Link shared"
      />
    </>
  );
};

export default ShareButton;
