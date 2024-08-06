'use client';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import assets, { ButtonID } from '@/constants';
import Image from 'next/image';

import { Fade, ThemeProvider } from '@mui/material';
import mootiezTheme, { themeColors } from '@/styles/mui/mootiezTheme';
import muiTheme from '@/styles/mui/muiTheme';
import colors from '@/styles/colors.config';
import MainBody from '@/components/MainBody';
import { MBTIData, getType } from '@/redux/features/mbti/mbtiSlice';
import React, { useEffect, useState, forwardRef } from 'react';
import TabSection, { TabPanel } from '@/components/TabSection';
import { Card, Box, Tab, Tabs, Grid, Typography } from '@mui/material';
import { Community } from '@/data/services/fetchCommunityService';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import SocialShareSection from '@/app/[locale]/mbti/mootiez-report/SocialShareSection';

import { Send } from 'lucide-react';

const ImageWithRetry: React.FC<{
  profileUrl: string;
  init: boolean;
  fadeIn?: boolean;
}> = ({ profileUrl, init, fadeIn }) => {
  const [retries, setRetries] = useState(0);
  const [src, setSrc] = useState(
    init
      ? profileUrl || assets.images.app.defaultAvatar
      : assets.images.app.toBeRevealedAvatar,
  );

  const maxRetries = 3;

  useEffect(() => {
    if (init) {
      setSrc(profileUrl || assets.images.app.defaultAvatar);
    }
  }, [init]);
  const handleImageError = () => {
    console.log('src:', src);
    if (retries < maxRetries) {
      setTimeout(() => {
        setRetries(retries + 1);
        setSrc(src + `?retry=${retries}`);
      }, 1000); // Retry after 1 second
    } else {
      setSrc(assets.images.app.toBeRevealedAvatar); // Fallback image after max retries
    }
  };

  const _img = (
    <Image
      src={src}
      alt="MBTI Card"
      fill
      priority
      style={{
        transform: 'scale(1.2)', // Enlarges the image to 110% of its original size
        objectFit: 'cover', // Ensures the image is not stretched
        objectPosition: 'center', // Centers the image
      }}
      onError={handleImageError}
    />
  );
  if (fadeIn) {
    return (
      <Fade in={true} timeout={5000}>
        {_img}
      </Fade>
    );
  }
  return _img;
};

/* Clip path group */
const CardFrame: React.FC<{
  children: React.ReactNode;
  mbtiType: string;
  profileUrl: string;
  bgColorStart: string;
  bgColorEnd: string;
  hasGrayOverlay?: boolean;
  sx?: React.CSSProperties;
  id: string;
  fadeIn?: boolean;
}> = ({
  id,
  children,
  mbtiType,
  profileUrl,
  bgColorStart,
  bgColorEnd,
  hasGrayOverlay = true,
  sx,
  fadeIn,
}) => {
  return (
    <Card
      id={id}
      sx={{
        background: `linear-gradient(${bgColorStart}, ${bgColorEnd})`,
        // height: 'calc(100vh - 60px)',
        minHeight: '607px',
        // maxHeight: '607px',
        aspectRatio: 375 / 607,
        color: colors.neutralSwatch.main[98],
        position: 'relative',
        boxShadow: 'none',
        ...sx,
      }}
    >
      <Box
        sx={{
          backgroundColor: hasGrayOverlay
            ? 'rgba(0,0,0,0.2)'
            : null /* Black background with opacity */,
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            padding: '4px 16px 0px 16px',
          }}
        >
          <Typography variant="labelReport" color={colors.white}>
            Mootiez.com
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative', // Required for Next.js Image component with fill layout
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              padding: '0px 8px',
            }}
          >
            <Typography variant="headlineReport">{mbtiType}</Typography>
          </Box>

          <Box
            id="mbti-card-avatar"
            sx={{
              width: '100%',
              aspectRatio: 1,
              overflow: 'hidden',
              position: 'relative', // Required for Next.js Image component with fill layout
              clipPath: ` polygon(
                      0 7.9%, /* This point approximates where the path would be vertically at y=29.962 */
                      19.2% 7.9%,
                      26.4% 0, /* This point approximates where the path moves to 0 on the x-axis */
                      100% 0, /* This point corresponds to the right top corner */
                      100% 96.6%, 
                      65.6% 96.6%, 
                      60.6% 100%, /* This point approximates where the path moves back to the x-axis */
                      0 100% /* This point corresponds to the left bottom corner */
                  );`,
            }}
          >
            {/* <Image
              src={profileUrl}
              alt="MBTI Card"
              fill
              priority
              style={{
                transform: 'scale(1.2)', // Enlarges the image to 110% of its original size
                objectFit: 'cover', // Ensures the image is not stretched
                objectPosition: 'center', // Centers the image
              }}
            /> */}
            <ImageWithRetry
              profileUrl={profileUrl}
              init={true}
              fadeIn={fadeIn}
            />
          </Box>
        </Box>

        {children}
      </Box>
    </Card>
  );
};

export default CardFrame;
