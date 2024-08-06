'use client';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import colors from '@/styles/colors.config';
import { X } from 'lucide-react';
import { Box, IconButton, Typography } from '@mui/material';

interface ContentDialogProps {
  open: boolean;
  onClose: (action: boolean) => void; // Function to call with the action result
  title?: string;
  content?: React.ReactNode;
}

const ContentDialog: React.FC<ContentDialogProps> = ({
  open,
  onClose,
  title = 'Info Center',
  content,
}) => {
  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="titleLarge" sx={{ textAlign: 'left' }}>
            {title}
          </Typography>
          <IconButton onClick={() => onClose(false)}>
            <X />
          </IconButton>
        </Box>
        <Box sx={{ paddingTop: '1rem' }} />
        {content}
      </DialogContent>
    </Dialog>
  );
};
export default ContentDialog;
