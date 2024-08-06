'use client';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';

import useCommunity from '@/hooks/useCommunity';
import { isMobile, isBrowser } from 'react-device-detect';
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import style from './page.module.scss';
import AppIcon from '@/components/AppIcon';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { resetAllState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hook';
import MessageDialog from '@/components/dialogs/MessageDialog.client';
import Image from 'next/image';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import colors from '@/styles/colors.config';
import { ButtonID } from '@/constants';
import { Box } from '@mui/material';

// type Props = {
//   params: { communityPathId: string };
//   // searchParams: { [key: string]: string | string[] | undefined }
// };

interface DeviceMotionEventiOS extends DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

const _useDeviceAnimation = () => {
  useEffect(() => {
    const handleMouseMove = (e: { clientX: any; clientY: any }) => {
      const { clientX, clientY } = e;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const moveX = ((clientX - screenWidth / 2) / screenWidth) * 5; // Adjust the multiplier (-50) for effect intensity
      const moveY = ((clientY - screenHeight / 2) / screenHeight) * 10;
      const scaffoldElement = document.querySelector(
        '.scaffold',
      ) as HTMLElement | null;

      if (scaffoldElement) {
        scaffoldElement.style.setProperty(
          '--background-pos-x',
          `${moveX + 50}%`,
        );
        scaffoldElement.style.setProperty(
          '--background-pos-y',
          `${moveY + 50}%`,
        );
      }
    };

    if (isBrowser) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isBrowser]);

  useEffect(() => {
    // TODO: Test this in the moble device
    function deviceMotionPermissionRequest() {
      // feature detect
      const requestPermission = (
        DeviceMotionEvent as unknown as DeviceMotionEventiOS
      ).requestPermission;
      if (typeof requestPermission === 'function') {
        requestPermission()
          .then((permissionState) => {
            if (permissionState === 'granted') {
              window.addEventListener('devicemotion', () => {});
            }
          })
          .catch(console.error);
      } else {
        // handle regular non iOS 13+ devices
        window.addEventListener('devicemotion', () => {});
      }
    }

    const handleDeviceMotion = (e: { acceleration: any }) => {
      console.log(e);
      const { acceleration } = e;
      const moveX = acceleration.x * 10; // Adjust multiplier as needed
      const moveY = acceleration.y * 10;

      const scaffoldElement = document.querySelector(
        '.scaffold',
      ) as HTMLElement | null;
      if (scaffoldElement) {
        scaffoldElement.style.setProperty(
          '--background-pos-x',
          `${moveX + 50}%`,
        );
        scaffoldElement.style.setProperty(
          '--background-pos-y',
          `${moveY + 50}%`,
        );
      }
    };

    if (isMobile) {
      deviceMotionPermissionRequest();
      // window.addEventListener('devicemotion', handleDeviceMotion);
      return () =>
        window.removeEventListener('devicemotion', handleDeviceMotion);
    }
  }, [isMobile]);
};

const Page: NextPage = () => {
  const { community } = useCommunity();
  const { logButtonClick } = useLogEvent();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [isConfirmedLogout, setIsConfirmedLogout] = useState<boolean>(false);
  const { navigate } = useAppRouting();
  const {
    utils: { dgSignOut },
  } = useDGAuth();
  const dispatch = useAppDispatch();
  const _ = _useDeviceAnimation();

  // catch confirm logout
  useEffect(() => {
    if (isConfirmedLogout === true) {
      navigate(routes.auth.login);
      dgSignOut();
      dispatch(resetAllState());
    }
  }, [isConfirmedLogout]);

  if (!community.community_id)
    return (
      /**
       * Save-Guard: If the community data is not loaded somehow, but the page is loaded.
       * [ i.e. user directly go to this page, and the router has completed before the community data is loaded ]
       */
      <LoadingPage loadingText="Loading Community Data" />
    );

  return (
    <>
      <Scaffold
        className={style.scaffold + ' scaffold'}
        style={{
          minHeight: '100svh',
          height: '100svh',
        }}
        mainBody={
          <div className="tw-bg-transparent tw-px-[1rem]">
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'start',
                alignItems: 'center',
                position: 'relative',
                paddingTop: '1rem',
              }}
            >
              <BackIconButton
                onClick={() => {
                  logButtonClick(ButtonID.join.logout, 'login page');
                  setIsSignOutDialogOpen(true);
                }}
              />
              <Image
                src={community.logo_url}
                alt="app-icon"
                width={112}
                height={36}
                style={{
                  paddingBottom: '0.7rem',
                }}
              />
            </div>
            <Card
              sx={{
                height: 'fit-content',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.40)',
                background: `linear-gradient(
                    180deg, 
                    ${colors.toRGBA(colors.primarySwatch.main[98], 0.4)} 0%, 
                    ${colors.primarySwatch.main[98]} 39.5%, 
                    ${colors.primarySwatch.main[98]} 64%, 
                    ${colors.toRGBA(colors.primarySwatch.main[98], 0.4)}  100%
                  )`,
                backdropFilter: 'blur(16px)',
                position: 'absolute',
                left: '16px',
                bottom: '4vh',
                // top: 'calc(100vh)',
                width: 'calc(100% - 32px)',
                '&:hover': {
                  border: '1px solid rgba(255, 255, 255, 0.40)',
                },
              }}
            >
              <CardContent
                sx={{
                  textAlign: 'center',
                }}
              >
                <div className="title-large tw-text-neutralSwatch-30">
                  Mootiez - MBTI Community
                </div>
                <div className="tw-h-[1.2vh]" aria-hidden="true"></div>
                <div className="body-medium tw-text-neutralSwatch-30">
                  We have not found your MBTI test result. Finish your MBTI test
                  first to proceed.
                </div>
                <div className="tw-h-[2vh]" aria-hidden="true"></div>

                <Button
                  variant="contained"
                  className="tw-w-full"
                  onClick={() => {
                    logButtonClick(ButtonID.join.join_mootiez, '');
                    const joinFormUrl =
                      process.env.START_MY_MBTI_URL || 'https://mootiez.com/';
                    window.open(joinFormUrl, '_blank');
                  }}
                >
                  Start Now
                </Button>
                {process.env.ENV === 'dev' && (
                  <>
                    <Box sx={{ height: 10 }} />
                    <Button
                      variant="contained"
                      className="tw-w-full"
                      onClick={() => {
                        const joinFormUrl =
                          window.location.origin +
                          '/mbti?s=1&referralcode=&p=2&i=3.5&httpreferer=notfound&ismbti=true&channel=telegram&t=7.5&j=2.5&e=1&f=1&ismale=1&n=5';
                        window.open(joinFormUrl, '_blank');
                      }}
                    >
                      Claim Account ( dev env only )
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        }
      />
      <MessageDialog
        open={isSignOutDialogOpen}
        onIsConfirm={(isConfirmed: boolean) => {
          setIsSignOutDialogOpen(false);
          setIsConfirmedLogout(isConfirmed);
        }}
        title="Sign out?"
        content="You are going to sign out from the Mootiez Community"
      />
    </>
  );
};
export default Page;
