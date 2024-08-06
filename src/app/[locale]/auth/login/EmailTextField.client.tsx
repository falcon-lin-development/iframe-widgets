'use client';
/**
 * This Widget is Reponsible for the entire Email Login behaviour
 */
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import { useAppSelector, useAppDispatch } from '@/redux/hook';
import {
  setEmail as _setEmail,
  setErrorMessage as _setErrorMessage,
} from '@/redux/features/authSlice';
import colors from '@/styles/colors.config';

const EmailTextField: React.FC = () => {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.authSlice.value.login.email);

  const setEmail = (value: string) => {
    dispatch(_setEmail(value));
  };
  const errorMessage = useAppSelector(
    (state) => state.authSlice.value.login.errorMessage,
  );
  const setErrorMessage = (value: string) => {
    dispatch(_setErrorMessage(value));
  };
  const hasError = errorMessage !== '';
  const successMessage = useAppSelector(
    (state) => state.authSlice.value.login.successMessage,
  );

  const getHelperText = () => {
    if (errorMessage) {
      return errorMessage;
    }
    if (successMessage) {
      return successMessage;
    }
    return '';
  };

  const onEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
  };

  const onEmailClear = () => {
    setEmail('');
    setErrorMessage('');
  };

  return (
    <TextField
      // hiddenLabel
      fullWidth
      required
      type="email"
      label="Email"
      placeholder="Email Address"
      variant="filled"
      value={email}
      onChange={onEmailInputChange}
      InputProps={{
        endAdornment: email && (
          <InputAdornment position="end">
            <IconButton onClick={onEmailClear} edge="end">
              <CancelIcon className="tw-text-neutralSwatch-30" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      error={hasError}
      helperText={getHelperText()}
      sx={{
        '& .MuiFormHelperText-root': {
          color: hasError ? 'red' : successMessage ? 'green' : 'inherit', // Green when success, red when error, default otherwise
        },
        '& .MuiInputBase-root.MuiFilledInput-root': {
          backgroundColor: `${colors.primarySwatch.main[95]} !important`,
        },
      }}
    />
  );
};

export default EmailTextField;
