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

enum ChineseZodiac {
  Rat = 'rat',
  Ox = 'ox',
  Tiger = 'tiger',
  Rabbit = 'rabbit',
  Dragon = 'dragon',
  Snake = 'snake',
  Horse = 'horse',
  Goat = 'goat',
  Monkey = 'monkey',
  Rooster = 'rooster',
  Dog = 'dog',
  Pig = 'pig',
}

const ChineseZodiacPage: NextPage = () => {
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
    state: { alreadyHasChineseZodiac, userAttributesInit },
  } = usePersonaAttributeBadges();

  // actions
  const _submitAndDropAttributes = async (attr: ChineseZodiac) => {
    // only drop the attriute to user
    dropUserAttribute({
      categoryType: CommunityBadgeCategoryType.chinesezodiac,
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
    return dOBToChineseZodiac(dateOfBirth);
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
                  alreadyHasChineseZodiac ||
                  dropUserAttributeState.fetching ||
                  Boolean(successMessage)
                }
              >
                <Typography variant="labelLarge">
                  {alreadyHasChineseZodiac ? 'Collected' : 'Collect'}
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

export default ChineseZodiacPage;

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

// This object maps Gregorian years to the date of Chinese New Year
// You would need to extend this for a wider range of years
const chineseNewYearDates: { [key: number]: string } = {
  1940: '1940-02-08',
  1941: '1941-01-27',
  1942: '1942-02-15',
  1943: '1943-02-05',
  1944: '1944-01-25',
  1945: '1945-02-13',
  1946: '1946-02-02',
  1947: '1947-01-22',
  1948: '1948-02-10',
  1949: '1949-01-29',
  1950: '1950-02-17',
  1951: '1951-02-06',
  1952: '1952-01-27',
  1953: '1953-02-14',
  1954: '1954-02-03',
  1955: '1955-01-24',
  1956: '1956-02-12',
  1957: '1957-01-31',
  1958: '1958-02-18',
  1959: '1959-02-08',
  1960: '1960-01-28',
  1961: '1961-02-15',
  1962: '1962-02-05',
  1963: '1963-01-25',
  1964: '1964-02-13',
  1965: '1965-02-02',
  1966: '1966-01-21',
  1967: '1967-02-09',
  1968: '1968-01-30',
  1969: '1969-02-17',
  1970: '1970-02-06',
  1971: '1971-01-27',
  1972: '1972-02-15',
  1973: '1973-02-03',
  1974: '1974-01-23',
  1975: '1975-02-11',
  1976: '1976-01-31',
  1977: '1977-02-18',
  1978: '1978-02-07',
  1979: '1979-01-28',
  1980: '1980-02-16',
  1981: '1981-02-05',
  1982: '1982-01-25',
  1983: '1983-02-13',
  1984: '1984-02-02',
  1985: '1985-02-20',
  1986: '1986-02-09',
  1987: '1987-01-29',
  1988: '1988-02-17',
  1989: '1989-02-06',
  1990: '1990-01-27',
  1991: '1991-02-15',
  1992: '1992-02-04',
  1993: '1993-01-23',
  1994: '1994-02-10',
  1995: '1995-01-31',
  1996: '1996-02-19',
  1997: '1997-02-07',
  1998: '1998-01-28',
  1999: '1999-02-16',
  2000: '2000-02-05',
  2001: '2001-01-24',
  2002: '2002-02-12',
  2003: '2003-02-01',
  2004: '2004-01-22',
  2005: '2005-02-09',
  2006: '2006-01-29',
  2007: '2007-02-18',
  2008: '2008-02-07',
  2009: '2009-01-26',
  2010: '2010-02-14',
  2011: '2011-02-03',
  2012: '2012-01-23',
  2013: '2013-02-10',
  2014: '2014-01-31',
  2015: '2015-02-19',
  2016: '2016-02-08',
  2017: '2017-01-28',
  2018: '2018-02-16',
  2019: '2019-02-05',
  2020: '2020-01-25',
  2021: '2021-02-12',
  2022: '2022-02-01',
  2023: '2023-01-22',
  2024: '2024-02-10',
  2025: '2025-01-29',
};

function dOBToChineseZodiac(dateOfBirth: Dayjs): ChineseZodiac {
  const zodiacSigns = Object.values(ChineseZodiac);

  let year = dateOfBirth.year();
  const monthDay = dateOfBirth.format('MM-DD');

  // Check if the date is before Chinese New Year
  if (
    chineseNewYearDates[year] &&
    monthDay < chineseNewYearDates[year].substring(5)
  ) {
    year -= 1;
  }

  // The Chinese zodiac repeats every 12 years
  // We add 8 because the zodiac cycle starts 8 years before year 0 in the Gregorian calendar
  const zodiacIndex = (year + 8) % 12;

  return zodiacSigns[zodiacIndex];
}
