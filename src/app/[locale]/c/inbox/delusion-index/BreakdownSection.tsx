'use client';
// External Libraries
import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import Image from 'next/image';
import { Card, Box, Tab, Tabs, Typography, Grid, Button } from '@mui/material';

// Hooks
import useReadFile from '@/hooks/useReadFile';

// Utilities and Redux Features
import {
  MBTIData,
  MBTIFromFriend,
  getType,
  stringToBreakDown,
} from '@/redux/features/mbti/mbtiSlice';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';

// Styles and Constants
import colors from '@/styles/colors.config';
import assets, { ButtonID } from '@/constants';
import Link from 'next/link';
import routes from '@/routes/routes';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';

const BreakdownSection: React.FC<{
  profile: CommunityProfile;
  cachedMBTIData: MBTIData;
  mbtiFromFriend: MBTIFromFriend;
}> = ({ cachedMBTIData, mbtiFromFriend, profile }) => {
  const { logButtonClick } = useLogEvent();
  const _freReport = useReadFile(
    assets.mbti.report[
      getType(mbtiFromFriend).toUpperCase() as keyof typeof assets.mbti.report
    ],
  );
  const frdReport = useMemo(() => {
    return _freReport.fileContent;
  }, [_freReport.fileContent]);
  const _Line: React.FC<{ s: string }> = ({ s }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="headline-small tw-text-primarySwatch-40">{s}</div>
        <div className="body-medium tw-text-primarySwatch-10">
          {stringToBreakDown(
            s as 'I' | 'E' | 'N' | 'S' | 'T' | 'F' | 'J' | 'P',
          )}
        </div>
      </Box>
    );
  };

  const _Half: React.FC<{
    bg: string;
    name: string;
    word: string;
    avatarUrl: string;
    mbtiType: string;
    viewDetails: React.ReactNode;
  }> = ({ name, avatarUrl, mbtiType, bg, viewDetails, word }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          width: '100%',
          gap: '12px',
          padding: '12px',
          alignItems: 'center',
          bgcolor: bg,
        }}
      >
        <Typography variant="titleSmall">
          {name} <br />
          {word}
        </Typography>
        <Image
          alt="Personality Avatar"
          src={avatarUrl}
          width={148}
          height={148}
          style={{ width: 148, height: 'auto', borderRadius: `8px` }}
        />
        <_Line s={mbtiType[0]} />
        <_Line s={mbtiType[1]} />
        <_Line s={mbtiType[2]} />
        <_Line s={mbtiType[3]} />
        {viewDetails}
      </Box>
    );
  };

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
        Which parts do I act differently?
      </Typography>

      <Grid
        container
        id="di-breakdown-card"
        sx={{
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Grid item xs={6}>
          <_Half
            bg={colors.primarySwatch.main[95]}
            name="You"
            word="think you are"
            avatarUrl={
              profile.profile_avatar_url || assets.images.app.defaultAvatar
            }
            mbtiType={getType(cachedMBTIData!)}
            viewDetails={
              <Link
                href={routes.c.inbox.mootiez_report}
                style={{ width: '100%' }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    logButtonClick(
                      ButtonID.di.view_detail,
                      `View Detail ${routes.c.inbox.mootiez_report}`,
                    );
                  }}
                >
                  View Details
                </Button>
              </Link>
            }
          />
        </Grid>

        <Grid item xs={6}>
          <_Half
            bg={colors.primarySwatch.main[98]}
            name={mbtiFromFriend.friend_name || 'You friend'}
            word="thinks you are"
            avatarUrl={
              assets.mbti.avatar[
                getType(mbtiFromFriend) as keyof typeof assets.mbti.avatar
              ] || assets.images.app.defaultAvatar
            }
            mbtiType={getType(mbtiFromFriend!)}
            viewDetails={
              <Link
                href={routes.c.inbox.mootiez_report}
                style={{ width: '100%' }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    logButtonClick(
                      ButtonID.di.view_detail,
                      `View Detail ${routes.c.inbox.mootiez_report}`,
                    );
                  }}
                >
                  View Details
                </Button>
              </Link>
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BreakdownSection;
