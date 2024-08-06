/**
 * @dev this element is for bottom selection button
 */
'use client';
import { useState } from 'react';

//
import {
  SxProps,
  TextField,
  Theme,
  TextFieldProps,
  InputAdornment,
} from '@mui/material';
import {
  SectionsBottomModalSheet,
  ModalSheetSelectionInfo,
} from '../SelectionSheet/BottomModalSelectionSheet.client';
import { ChevronDown } from 'lucide-react';

type Props = TextFieldProps & {
  // @dev add props here
  selectionInfo: ModalSheetSelectionInfo;
  onSelectValue: (value: any) => void;
  displayText: string;
  sx?: SxProps<Theme>;
};

const BottomSelectionButton: React.FC<Props> = ({
  selectionInfo,
  onSelectValue,
  displayText,
  sx,
  ...textFieldProps // Spread the rest of the props
}) => {
  const [isSelectionSheetOpen, setIsSelectionSheetOpen] = useState(false);
  return (
    <>
      <TextField
        hiddenLabel
        fullWidth
        variant="filled"
        sx={{
          ...sx,
          // "& .MuiInputBase-root.MuiFilledInput-root": {
          //     borderBottomStyle: 'solid',
          //     color: colors.neutralSwatch.main[10],
          //     backgroundColor: colors.neutralSwatch.main[95],
          //     borderBottomColor: colors.primarySwatch.main[40],
          //     "&.Mui-disabled::before": {
          //         borderBottomStyle: 'solid',
          //     },
          // },
          // "&:hover": {
          //     cursor: "pointer",
          // },
          // pointerEvents: "auto",
        }}
        value={displayText}
        onClick={() => {
          setIsSelectionSheetOpen(true);
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position={'end'}>
              {/* <IconButton onClick={() => setContent('')} edge={'start'} sx={{}}> */}
              <ChevronDown className="tw-text-neutralSwatch-30" />
              {/* </IconButton> */}
            </InputAdornment>
          ),
        }}
        {...textFieldProps}
      />
      <SectionsBottomModalSheet
        isOpen={isSelectionSheetOpen}
        setOpen={setIsSelectionSheetOpen}
        setSelectedValue={onSelectValue}
        info={selectionInfo}
      />
    </>
  );
};

export default BottomSelectionButton;
