'use client';
import {
  IconButton,
  InputAdornment,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
} from '@mui/material';
import { useMemo } from 'react';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import colors from '@/styles/colors.config';

type _TextFieldProps = TextFieldProps & {
  content: string;
  setContent: (content: string) => void;
  errorMessage?: string;
  hasError?: boolean;
  maxLength?: string;
  noEndProp?: boolean;
  sx?: SxProps<Theme>;
};

const CancellableTextField: React.FC<_TextFieldProps> = ({
  content,
  setContent,
  errorMessage = '',
  hasError = false,
  maxLength,
  noEndProp,
  sx,
  ...textFieldProps // Spread the rest of the props
}) => {
  const helperText = useMemo(() => {
    if (errorMessage) {
      return errorMessage;
    } else if (maxLength) {
      // return `${content.length}/${maxLength}`;
      return '';
    } else {
      return '';
    }
  }, [content, errorMessage, maxLength]);

  return (
    <TextField
      fullWidth
      required
      type="text"
      variant="filled"
      value={content}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value);
      }}
      error={hasError}
      helperText={helperText}
      InputProps={{
        endAdornment: !noEndProp && content && (
          <InputAdornment position={'end'}>
            <IconButton onClick={() => setContent('')} edge={'start'} sx={{}}>
              <CancelIcon className="tw-text-neutralSwatch-30" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      inputProps={{
        maxLength: maxLength,
        ...textFieldProps.inputProps,
      }}
      {...textFieldProps}
      sx={{
        '& .MuiFormHelperText-root': {
          color: hasError ? 'red' : colors.neutralSwatch.main[50], // Green when success, red when error, default otherwise
          textAlign: hasError ? 'left' : 'right',
        },
        ...sx,
      }}
    />
  );
};

export default CancellableTextField;
