'use client';
// External Libraries
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Card, Box, Tab, Tabs, Typography, Grid } from '@mui/material';
import { capitalize } from '@mui/material/utils';
import mootiezTheme, { themeColors } from '@/styles/mui/mootiezTheme';

// Utilities and Redux Features
import {
  MBTIData,
  MBTIFromFriend,
  getType,
} from '@/redux/features/mbti/mbtiSlice';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import { getCopyWritingIndexFromDI, getImageIndexFromDI } from './utils';
import { calculateMBTIScale } from '../mootiez-report/cards/CardMain';

// Styles and Constants
import colors from '@/styles/colors.config';
import assets from '@/constants';

const _Line: React.FC<{
  l: React.ReactNode;
  r: React.ReactNode;
  percentage1: number;
  percentage2: number;
  bgColor: string;
}> = ({ l, r, percentage1, percentage2, bgColor }) => {
  return (
    <Grid
      container
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '20px 0px',
        fontSize: '12px',
        // gap: '12px',
        bgcolor: bgColor,
      }}
    >
      <Grid
        item
        xs={3}
        sx={{
          textAlign: 'right',
        }}
      >
        {l}
      </Grid>
      <Grid
        item
        sx={{
          position: 'relative',
          marginX: '10px',
        }}
      >
        <Box
          sx={{
            width: '100%',
            minWidth: '120px',
            maxWidth: '133px',
            height: '4px',
            bgcolor: colors.neutralSwatch.main[90],
            borderRadius: '40px',
          }}
        ></Box>
        <Box
          title={`${percentage1}%`}
          sx={{
            width: '12px',
            height: '12px',
            bgcolor: themeColors.blue,
            borderRadius: '9999px',
            position: 'absolute',
            top: '-4px',
            left: `${percentage1}%`,
            // left: "100%"
          }}
        >
          <Typography
            variant="labelMedium"
            sx={{
              color: colors.neutralSwatch.main[30],
              textAlign: 'center',
              position: 'absolute',
              top: '-18px',
              left: '-50%',
              padding: '0px 4px 0 4px',
              bgcolor: themeColors.blue,
              borderRadius: '100px',
            }}
          >
            {percentage1.toPrecision(2)}
          </Typography>
        </Box>

        <Box
          title={`${percentage2}%`}
          sx={{
            width: '12px',
            height: '12px',
            bgcolor: themeColors.yellow,
            borderRadius: '9999px',
            position: 'absolute',
            top: '-4px',
            left: `${percentage2}%`,
          }}
        >
          <Typography
            variant="labelMedium"
            sx={{
              color: colors.neutralSwatch.main[30],
              textAlign: 'center',
              position: 'absolute',
              top: '18px',
              left: '-50%',
              padding: '0px 4px 0 4px',
              bgcolor: themeColors.yellow,
              borderRadius: '100px',
            }}
          >
            {percentage2.toPrecision(2)}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={3}>
        {r}
      </Grid>
    </Grid>
  );
};

const DifferenceCard: React.FC<{
  profile: CommunityProfile;
  mbti: MBTIData;
  mbtiFromFriend: MBTIFromFriend;
  // reportJson: Record<string, any>;
}> = ({
  profile,
  mbti,
  mbtiFromFriend,
  // reportJson,
  // frdReport,
}) => {
  const HalfCard: React.FC<{
    name: string;
    description: string;
    avatar: string;
    mbtiType: string;
    bgColor: string;
  }> = ({ name, description, avatar, mbtiType, bgColor }) => {
    return (
      <Box
        sx={{
          flex: '1', // This will make sure both boxes take up equal space
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start', // This centers the avatar in the flex container
          alignItems: 'center',
          padding: '12px',
          gap: '12px',
          maxWidth: '50%',
          backgroundColor: bgColor || colors.primarySwatch.main[95],
        }}
      >
        <Typography variant="titleSmall">
          {name} <br />
          {description}
        </Typography>
        <Image
          alt="Personality Avatar"
          src={avatar}
          width={148}
          height={148}
          style={{ width: 148, height: 'auto', borderRadius: `8px` }}
        />
        <div className="headline-small tw-text-primarySwatch-40 ">
          {mbtiType}
        </div>
      </Box>
    );
  };

  return (
    <Card
      id="di-difference-card"
      sx={{
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'row',
        boxShadow: 'none',
        position: 'relative',
        '&:hover': {
          border: 'none',
          cursor: 'default',
        },
      }}
    >
      <HalfCard
        name="You"
        description="think you are"
        avatar={profile.profile_avatar_url || assets.images.app.defaultAvatar}
        mbtiType={getType(mbti)}
        bgColor={themeColors.blue}
      />
      <HalfCard
        name={mbtiFromFriend.friend_name || 'Your friend'}
        description="thinks you are"
        avatar={
          assets.mbti.avatar[
            getType(mbtiFromFriend) as keyof typeof assets.mbti.avatar
          ] || assets.images.app.defaultAvatar
        }
        mbtiType={getType(mbtiFromFriend)}
        bgColor={themeColors.yellow}
      />
    </Card>
  );
};

const DifferenceSection: React.FC<{
  dI: number;
  profile: CommunityProfile;
  mbti: MBTIData;
  mbtiFromFriend: MBTIFromFriend;
  reportJson: Record<string, any>;
  copywritings: Record<string, any> | null;
}> = ({ dI, profile, mbti, mbtiFromFriend, reportJson, copywritings }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '12px',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="headlineSmall">
        {copywritings &&
          capitalize(
            copywritings[getCopyWritingIndexFromDI(dI)]['Headline_short'],
          )}
      </Typography>
      <DifferenceCard
        profile={profile}
        mbti={mbti}
        mbtiFromFriend={mbtiFromFriend}
      />

      <Box
        sx={{
          color: colors.neutralSwatch.main[30],
          width: '100%',
        }}
      >
        <_Line
          l={
            <>
              <Typography
                variant="titleSmall"
                sx={{ color: colors.primarySwatch.main.primary }}
              >
                E
              </Typography>
              <Typography variant="titleSmall">xtraverted</Typography>
            </>
          }
          r={
            <>
              <Typography
                variant="titleSmall"
                sx={{ color: colors.primarySwatch.main.primary }}
              >
                I
              </Typography>
              <Typography variant="titleSmall">ntroverted</Typography>
            </>
          }
          percentage1={calculateMBTIScale(mbti.e, mbti.i)}
          percentage2={calculateMBTIScale(mbtiFromFriend.e, mbtiFromFriend.i)}
          bgColor={colors.primarySwatch.main[98]}
        />
        <_Line
          l={
            <>
              <Typography variant="titleSmall">i</Typography>
              <Typography
                variant="titleSmall"
                sx={{ color: colors.primarySwatch.main.primary }}
              >
                N
              </Typography>
              <Typography variant="titleSmall">tuitive</Typography>
            </>
          }
          r={
            <>
              <Typography
                variant="titleSmall"
                sx={{ color: colors.primarySwatch.main.primary }}
              >
                S
              </Typography>
              <Typography variant="titleSmall">ensing</Typography>
            </>
          }
          percentage1={calculateMBTIScale(mbti.n, mbti.s)}
          percentage2={calculateMBTIScale(mbtiFromFriend.n, mbtiFromFriend.s)}
          bgColor={colors.primarySwatch.main[95]}
        />
        <_Line
          l={
            <>
              <Typography
                variant="titleSmall"
                sx={{ color: colors.primarySwatch.main.primary }}
              >
                T
              </Typography>
              <Typography variant="titleSmall">hinking</Typography>
            </>
          }
          r={
            <>
              <Typography
                variant="titleSmall"
                sx={{ color: colors.primarySwatch.main.primary }}
              >
                F
              </Typography>
              <Typography variant="titleSmall">eeling</Typography>
            </>
          }
          percentage1={calculateMBTIScale(mbti.t, mbti.f, 10)}
          percentage2={calculateMBTIScale(
            mbtiFromFriend.t,
            mbtiFromFriend.f,
            10,
          )}
          bgColor={colors.primarySwatch.main[98]}
        />
        <_Line
          l={
            <>
              <Typography
                variant="titleSmall"
                sx={{ color: colors.primarySwatch.main.primary }}
              >
                J
              </Typography>
              <Typography variant="titleSmall">udging</Typography>
            </>
          }
          r={
            <>
              <Typography
                variant="titleSmall"
                sx={{ color: colors.primarySwatch.main.primary }}
              >
                P
              </Typography>
              <Typography variant="titleSmall">erceiving</Typography>
            </>
          }
          percentage1={calculateMBTIScale(mbti.j, mbti.p)}
          percentage2={calculateMBTIScale(mbtiFromFriend.j, mbtiFromFriend.p)}
          bgColor={colors.primarySwatch.main[95]}
        />
      </Box>
    </Box>
  );
};

export default DifferenceSection;
