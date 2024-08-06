'use client';
import React from 'react';
import { Checkbox, Box, Typography } from '@mui/material/';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setAgreedToTerms as _setAgreedToTerms } from '@/redux/features/authSlice';
import Image from 'next/image';
import colors from '@/styles/colors.config';
import assets from '@/constants';

type Props = {
  isChecked: boolean;
  iconSize?: string;
};

export const CheckIcon: React.FC<Props> = ({
  isChecked,

  iconSize = '20px',
}) => {
  if (isChecked) {
    return (
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          backgroundColor: colors.primarySwatch.main[40],
          borderRadius: '0.25rem',
          // border: `0.125rem solid ${colors.primarySwatch.main[98]}`,
        }}
      >
        <Image
          src={assets.icons.checkbox} // Use your SVG icon's path here
          alt="Checked"
          width={54} // Set the desired size
          height={54} // Set the desired size
        />
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          width: iconSize,
          height: iconSize,
          borderRadius: '0.25rem',
        }}
      >
        <CheckBoxOutlineBlankIcon />
      </Box>
    );
  }
};

const TnCCheckbox: React.FC = () => {
  const dispatch = useAppDispatch();
  const agreedToTerms = useAppSelector(
    (state) => state.authSlice.value.login.agreedToTerms,
  );
  const setAgreedToTerms = (value: boolean) => {
    dispatch(_setAgreedToTerms(value));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(event.target.checked);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          // justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Checkbox
          checked={agreedToTerms}
          onChange={handleCheckboxChange}
          checkedIcon={<CheckIcon isChecked={true} />}
          // icon={<CheckIcon isChecked={false} />}
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          name="agreedToTerms"
          sx={{
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        />
        <Box sx={{ mr: '8px' }} />
        <Box
          className="body-small tw-text-neutralSwatch-30"
          sx={{
            fontFamily: 'Basier Circle',
          }}
        >
          {/* By continuing, you agree with Our{' '} */}I agree the{' '}
          <Link
            className="tw-text-primarySwatch-40"
            href="https://www.mootiez.com/terms"
            target="_blank"
            // rel="noopener"
          >
            Terms and Conditions
          </Link>{' '}
          and{' '}
          <Link
            className="tw-text-primarySwatch-40"
            href="https://www.iubenda.com/privacy-policy/30792539/legal"
            target="_blank"
            // rel="noopener"
          >
            Privacy Policy
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default TnCCheckbox;
