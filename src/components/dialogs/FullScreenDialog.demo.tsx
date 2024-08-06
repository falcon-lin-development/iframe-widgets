'use client';
/**
 * @dev
 * This is a full screen dialog component that is used to display content in a full screen dialog.
 */

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';
import { Box, Typography } from '@mui/material';
import colors from '@/styles/colors.config';

interface FullScreenDialogProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const FullScreenDialog: React.FC<FullScreenDialogProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      {children}
    </Dialog>
  );
};

export default FullScreenDialog;
