import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

export default function BasicDatePicker({
  value,
  setValue,
}: {
  value: Dayjs;
  setValue: (value: Dayjs) => void;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <DemoContainer components={['DatePicker']}> */}
      {/* <DatePicker label="Basic date picker" /> */}
      <DatePicker
        sx={{
          width: '100%',
        }}
        // label="Controlled picker"
        value={value}
        onChange={(newValue) => newValue && setValue(newValue)}
      />
      {/* </DemoContainer> */}
    </LocalizationProvider>
  );
}
