'use client';
import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MessageDialog from '@/components/dialogs/MessageDialog.client';
import { Avatar, Button, CircularProgress } from '@mui/material';

import { useDGAuth } from '@dttd-io/dg-auth-lib';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import assets, { ButtonID } from '@/constants';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { resetAllState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hook';

import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import {
  useSearchParams,
  useRouter,
  usePathname,
  ReadonlyURLSearchParams,
} from 'next/navigation';

const removeSearchParams = (param: ReadonlyURLSearchParams, key: string) => {
  /**
   * remove search params and replace the current url without reloading the page
   *
   */
  // const currentUrl = new URL(window.location.href);
  // const searchParams = currentUrl.searchParams;
  // searchParams.delete(key);
  // const newUrl = `${currentUrl.pathname}?${searchParams.toString()}`;
  // window.history.replaceState(null, '', newUrl);

  // Create a new URLSearchParams object based on the current search parameters
  // Delete the parameter
  const newSearchParams = new URLSearchParams(param);
  newSearchParams.delete(key);
  return newSearchParams.toString();
};

const Page: NextPage = () => {
  const {
    utils: { dgSignOut },
  } = useDGAuth();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [isConfirmedLogout, setIsConfirmedLogout] = useState<boolean>(false);
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const { navigate } = useAppRouting();
  const dispatch = useAppDispatch();
  const { logButtonClick } = useLogEvent();
  const pathName = usePathname();
  const param = useSearchParams();

  useEffect(() => {
    // basically when inside this page, remove the directsend param
    const newSearchParamm = removeSearchParams(param, 'directsend');
    const newUrl = `${pathName}?${newSearchParamm}`;
    navigate(newUrl);
  }, []);

  // catch confirm logout
  useEffect(() => {
    if (isConfirmedLogout === true) {
      dgSignOut();
      dispatch(resetAllState());
    }
  }, [isConfirmedLogout]);

  return (
    <>
      <Scaffold
        appbar={
          <AppBar
            backButton={
              <BackIconButton
                onClick={() => {
                  logButtonClick(
                    ButtonID.already_has_mootiez.logout,
                    'login page',
                  );
                  setIsSignOutDialogOpen(true);
                }}
              />
            }
            title="Get My Mootiez"
          />
        }
        mainBody={
          <MainBody
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 16px',
            }}
          >
            <Avatar
              sx={{ width: 74, height: 74 }}
              src={
                communityProfile.profile_avatar_url ||
                assets.images.app.defaultAvatar
              }
            />
            <div className="tw-pt-[1vh]" aria-label="spacer" />
            <div className="headline-small tw-text-primarySwatch-40">
              {communityProfile.profile_name || 'Mootiez'}
            </div>
            <div className="tw-pt-[3vh]" aria-label="spacer" />

            <div className="title-large tw-text-neutralSwatch-10">
              Mootiez Found!
            </div>
            <div className="tw-pt-[1vh]" aria-label="spacer" />

            <div className="body-large tw-text-neutralSwatch-30 tw-text-center">
              Each account can only claim one Mootiez. Build and connect with
              this unique representation now!
            </div>
            <div className="tw-pt-[3vh]" aria-label="spacer" />

            <Button
              variant="contained"
              color="primary"
              sx={{
                width: '80%',
              }}
              onClick={() => {
                logButtonClick(
                  ButtonID.already_has_mootiez.enter_app,
                  'community-main-page',
                );

                navigate(routes.c._home);
              }}
            >
              Enter App as {communityProfile.profile_name || 'me'}
            </Button>
            <div className="tw-pt-[1vh]" aria-label="spacer" />

            <Button
              color="primary"
              sx={{
                width: '80%',
              }}
              onClick={() => {
                logButtonClick(
                  ButtonID.already_has_mootiez.logout,
                  'login page',
                );
                setIsSignOutDialogOpen(true);
              }}
            >
              Sign up with Another Email
            </Button>
          </MainBody>
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
