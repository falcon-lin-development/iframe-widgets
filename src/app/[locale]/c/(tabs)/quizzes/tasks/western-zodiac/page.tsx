'use client';
import { NextPage } from 'next';
import React from 'react';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import Scaffold from '@/components/scaffolds/Scaffold';
import { Snackbar, Button, Typography, Box, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMutationDropUserAttribute } from '@/data/graphql/hooks/useMutationDropUserAttribute';
import { useCenterFixedPosition } from '@/utils/usePosition';
import { isMobile } from 'react-device-detect';
import { DatePicker, LoadingButton } from '@mui/lab';
import { usePersonaAttributeBadges } from '@/data/graphql/hooks/usePersonaAttributeBadges';
import BasicDatePicker from '@/components/datePickers/basicPicker';
import dayjs, { Dayjs } from 'dayjs';
import { CommunityBadgeCategoryType } from '@/data/graphql/models/CommunityBadgeDefinition';
import LoadingPage from '@/components/loadingScreens/LoadingPage';

enum WesternZodiac {
  Aries = 'aries',
  Taurus = 'taurus',
  Gemini = 'gemini',
  Cancer = 'cancer',
  Leo = 'leo',
  Virgo = 'virgo',
  Libra = 'libra',
  Scorpio = 'scorpio',
  Sagittarius = 'sagittarius',
  Capricorn = 'capricorn',
  Aquarius = 'aquarius',
  Pisces = 'pisces',
}

const WesternZodiacPage: NextPage = () => {
  const [successMessage, setSuccessMessage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState<Dayjs>(
    dayjs(new Date()),
  );
  const { left } = useCenterFixedPosition();
  const router = useRouter();

  const {
    state: { dropUserAttributeState },
    actions: { dropUserAttribute },
  } = useMutationDropUserAttribute();

  const {
    state: { alreadyHasWesternZodiac: _alreadyHasAttr, userAttributesInit },
  } = usePersonaAttributeBadges();

  // actions
  const _submitAndDropAttributes = async (attr: WesternZodiac) => {
    // only drop the attriute to user
    dropUserAttribute({
      categoryType: CommunityBadgeCategoryType.westernzodiac,
      categoryValue: attr.toLocaleLowerCase(),
    }).then((res) => {
      if (res.data?.giveawayCommunityBadge?.__typename === 'GraphqlError') {
        setErrorMessage(res.data.giveawayCommunityBadge.message);
      } else {
        setSuccessMessage('Collected successfully');
      }
    });
  };

  const calculateResult = () => {
    return dOBToWesternZodiac(dateOfBirth);
  };

  if (!userAttributesInit) {
    return <LoadingPage loadingText="Loading your data" />;
  }

  return (
    <>
      <Scaffold
        appbar={
          <AppBar
            title="When is your birthday?"
            backButton={<BackIconButton />}
          />
        }
        mainBody={
          <>
            <DatePickerPage
              dateOfBirth={dateOfBirth}
              setDateOfBirth={setDateOfBirth}
            />

            {/* Floating Button */}
            <Box // bot mid floating button
              sx={{
                position: 'fixed',
                bottom: '16px',
                left: `${left}px`,
                transform: isMobile ? 'translateX(-50%)' : 'translateX(-52%)',
              }}
            >
              <LoadingButton
                variant="contained"
                onClick={() => {
                  setErrorMessage('');
                  const attr = calculateResult();
                  _submitAndDropAttributes(attr);
                }}
                sx={{
                  paddingX: '24px',
                  // width: '272px',
                }}
                loading={dropUserAttributeState.fetching}
                disabled={
                  !Boolean(dateOfBirth) ||
                  _alreadyHasAttr ||
                  dropUserAttributeState.fetching ||
                  Boolean(successMessage)
                }
              >
                <Typography variant="labelLarge">
                  {_alreadyHasAttr ? 'Collected' : 'Collect'}
                </Typography>
              </LoadingButton>
            </Box>

            {/* snackbars */}
            <Snackbar
              open={Boolean(errorMessage)}
              autoHideDuration={6000}
              onClose={() => setErrorMessage('')}
              message={errorMessage}
            />
            <Snackbar
              open={Boolean(successMessage)}
              autoHideDuration={6000}
              onClose={() => {
                setSuccessMessage('');
                router.back();
              }}
              message={successMessage}
              action={
                <>
                  <Button
                    onClick={() => {
                      setSuccessMessage('');
                      router.back();
                    }}
                  >
                    <Typography>Go Back</Typography>
                  </Button>
                </>
              }
            />
          </>
        }
      />
    </>
  );
};

export default WesternZodiacPage;

const DatePickerPage: React.FC<{
  dateOfBirth: Dayjs;
  setDateOfBirth: (date: Dayjs) => void;
}> = ({ dateOfBirth, setDateOfBirth }) => {
  return (
    <>
      <MainBody
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '24px',
        }}
      >
        <BasicDatePicker value={dateOfBirth} setValue={setDateOfBirth} />
      </MainBody>
    </>
  );
};

// Define the date ranges for each zodiac sign
const zodiacRanges = [
  { sign: WesternZodiac.Capricorn, start: '12-22', end: '01-19' },
  { sign: WesternZodiac.Aquarius, start: '01-20', end: '02-18' },
  { sign: WesternZodiac.Pisces, start: '02-19', end: '03-20' },
  { sign: WesternZodiac.Aries, start: '03-21', end: '04-19' },
  { sign: WesternZodiac.Taurus, start: '04-20', end: '05-20' },
  { sign: WesternZodiac.Gemini, start: '05-21', end: '06-20' },
  { sign: WesternZodiac.Cancer, start: '06-21', end: '07-22' },
  { sign: WesternZodiac.Leo, start: '07-23', end: '08-22' },
  { sign: WesternZodiac.Virgo, start: '08-23', end: '09-22' },
  { sign: WesternZodiac.Libra, start: '09-23', end: '10-22' },
  { sign: WesternZodiac.Scorpio, start: '10-23', end: '11-21' },
  { sign: WesternZodiac.Sagittarius, start: '11-22', end: '12-21' },
];

function dOBToWesternZodiac(dateOfBirth: Dayjs): WesternZodiac {
  const zodiacSigns = Object.values(WesternZodiac);

  const monthDay = dateOfBirth.format('MM-DD');

  // Define the date ranges for each zodiac sign
  const zodiacRanges = [
    { sign: WesternZodiac.Capricorn, start: '12-22', end: '01-19' },
    { sign: WesternZodiac.Aquarius, start: '01-20', end: '02-18' },
    { sign: WesternZodiac.Pisces, start: '02-19', end: '03-20' },
    { sign: WesternZodiac.Aries, start: '03-21', end: '04-19' },
    { sign: WesternZodiac.Taurus, start: '04-20', end: '05-20' },
    { sign: WesternZodiac.Gemini, start: '05-21', end: '06-20' },
    { sign: WesternZodiac.Cancer, start: '06-21', end: '07-22' },
    { sign: WesternZodiac.Leo, start: '07-23', end: '08-22' },
    { sign: WesternZodiac.Virgo, start: '08-23', end: '09-22' },
    { sign: WesternZodiac.Libra, start: '09-23', end: '10-22' },
    { sign: WesternZodiac.Scorpio, start: '10-23', end: '11-21' },
    { sign: WesternZodiac.Sagittarius, start: '11-22', end: '12-21' },
  ];

  // Special case for Capricorn, which spans across the new year
  if (monthDay >= '12-22' || monthDay <= '01-19') {
    return WesternZodiac.Capricorn;
  }

  // Check other zodiac signs
  for (const range of zodiacRanges) {
    if (monthDay >= range.start && monthDay <= range.end) {
      return range.sign;
    }
  }

  // This should never happen if all dates are covered
  alert('Unable to determine Western Zodiac sign');
  return WesternZodiac.Aries;
}
