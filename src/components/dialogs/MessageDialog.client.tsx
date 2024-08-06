'use client';
import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import colors from '@/styles/colors.config';

export const useConfirmActionMessage = () => {
  // const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [onConfirmCallBack, setOnConfirmCallBack] = React.useState<
    null | ((isConfirmed: boolean) => Promise<void>)
  >(null);

  const confirmAction = async (
    message: string,
    action: () => Promise<void>,
  ) => {
    setMessage(message);
    setOnConfirmCallBack(() => () => action());
  };

  useEffect(() => {
    if (isConfirmed) {
      onConfirmCallBack && onConfirmCallBack(isConfirmed);
      _clearStates();
    }
  }, [isConfirmed, onConfirmCallBack]);

  const _clearStates = () => {
    setMessage('');
    setIsConfirmed(false);
    setOnConfirmCallBack(null);
  };

  return {
    state: {
      isOpen: Boolean(onConfirmCallBack),
      message,
    },
    actions: {
      setIsConfirmed: (isConfirmed: boolean) => {
        if (!isConfirmed) {
          _clearStates();
        } else {
          setIsConfirmed(isConfirmed);
        }
      },
      confirmAction,
    },
  };
};

interface MessageDialogProps {
  open: boolean;
  onIsConfirm: (isConfirmed: boolean) => void; // Function to call with the action result
  title?: string;
  content?: string;
}

const IsConfirmMessageDialog: React.FC<MessageDialogProps> = ({
  open,
  onIsConfirm,
  title = 'Message Center',
  content = 'Are you sure?',
}) => {
  return (
    <Dialog open={open} onClose={() => onIsConfirm(false)}>
      <DialogTitle sx={{ textAlign: 'left' }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: 'left' }}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onIsConfirm(false)}
          sx={{
            color: colors.primarySwatch.main[40],
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => onIsConfirm(true)}
          sx={{
            color: colors.primarySwatch.main[40],
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IsConfirmMessageDialog;
