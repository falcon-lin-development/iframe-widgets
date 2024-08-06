/**
 * this page is just a temporary page for waiting for the user to click on the link, should not really do anything
 */
'use client';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import MagicLinkSignInButton from '@/app/[locale]/auth/login/MagicLinkSignInButton.client';
import routes from '@/routes/routes';
import useCommunity from '@/hooks/useCommunity';
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import Image from 'next/image';
import { Box, Button, Typography } from '@mui/material';
import colors from '@/styles/colors.config';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { clearState } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import assets from '@/constants';

const _useNextLoginUrls = () => {
  const searchParams = useSearchParams();
  const param = new URLSearchParams(searchParams.toString());
  param.delete('next');
  const nexturl =
    (searchParams.get('next') || routes.none) + '?' + param.toString();
  const loginurl = routes.auth.login + `?next=${nexturl}`;

  return { nexturl, loginurl };
};

const Page: NextPage = () => {
  const searchParams = useSearchParams();
  const { community, communityPathId } = useCommunity();
  const { nexturl, loginurl } = _useNextLoginUrls();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const email = useAppSelector((state) => state.authSlice.value.login.email);

  return (
    <Scaffold
      appbar={
        <AppBar title="Email Confirmation" backButton={<BackIconButton />} />
      }
      mainBody={
        <MainBody
          style={{
            padding: '12px',
          }}
        >
          {/* <div className="tw-pt-[3vh]" aria-hidden="true"></div> */}
          <Box paddingTop={'50px'} aria-hidden="true"></Box>
          <Image
            src={assets.images.auth.emailSent}
            alt="email sent"
            width={343}
            height={228}
            style={{
              width: '343px',
              height: '228px',
            }}
          ></Image>
          <Box paddingTop={'16px'} aria-hidden="true"></Box>

          {/* <div className="title-large tw-text-neutralSwatch-10 tw-text-center">
            Just One More Step Ahead!
          </div> */}
          <Typography
            variant={'titleLarge'}
            className=" tw-text-neutralSwatch-10 tw-text-center"
          >
            Check Your Email
          </Typography>
          {/* <div className="tw-pt-[1.2vh]" aria-hidden="true"></div> */}
          {/* <div className="body-large tw-text-neutralSwatch-30 tw-text-center">
            We just sent a confirmation email to
          </div> */}
          {/* <div className="tw-pt-[2.5vh]" aria-hidden="true"></div> */}
          <Box paddingTop={'24px'} aria-hidden="true"></Box>
          <Typography
            variant={'titleLarge'}
            className="tw-text-center"
            sx={{
              color: colors.primarySwatch.main[40],
              overflowWrap: 'anywhere',
            }}
          >
            {email}
          </Typography>
          <Box paddingTop={'24px'} aria-hidden="true"></Box>

          {/* <div className="title-large tw-text-primarySwatch-40 tw-text-center"> */}
          {/* </div> */}
          {/* <div className="tw-pt-[2.5vh]" aria-hidden="true"></div> */}
          {/* <Box
            sx={{
              backgroundColor: colors.primarySwatch.main[98],
              padding: '12px',
              borderRadius: '8px',
              gap: '24px',
            }}
          >
            <div className="body-large tw-text-neutralSwatch-30 tw-text-center">
              Please check your email inbox and click the{' '}
              <span className="tw-text-primarySwatch-40">
                “Sign up / Log in”
              </span>{' '}
              button in the email to continue!
            </div>
          </Box> */}
          {/* <div className="tw-pt-[4vh]" aria-hidden="true"></div> */}
          <Box
            sx={{
              width: '254px',
            }}
          >
            <MagicLinkSignInButton
              nexturl={nexturl}
              loginurl={loginurl}
              btnText="Resend"
              templateId={
                searchParams.get('ismbti') ? 'mootiez-onboard' : 'mootiez-login'
              }
            />
          </Box>
          {/* <div className="tw-pt-[1vh]" aria-hidden="true"></div> */}
          {/* <Button
            fullWidth
            sx={{
              width: '254px',
            }}
            onClick={() => {
              dispatch(clearState());
              router.back();
            }}
          >
            Try with Another Email
          </Button> */}
        </MainBody>
      }
    />
  );
};

export default Page;
