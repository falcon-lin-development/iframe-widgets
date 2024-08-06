/**
 * should support login with next parameters, so after logging in, it will redirect to the page.
 */

'use client';
import { NextPage } from 'next';
import React, { useEffect } from 'react';
import style from './animation.module.css';

// skeleton
import Image from 'next/image';
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import AppIcon from '@/components/AppIcon';
import MainBody from '@/components/MainBody';
import SoftFusionScafford from '@/components/scaffolds/SoftFusionScaffold';
import MagicLinkSignInButton from '@/app/[locale]/auth/login/MagicLinkSignInButton.client';
import GoogleSignInButton from '@/app/[locale]/auth/login/GoogleSignInButton.client';
import DividerWithText from '@/components/DividerWithText';
import EmailTextField from './EmailTextField.client';
import TnCCheckbox from './TnCCheckbox.client';
import { Box, Button, CircularProgress, Divider } from '@mui/material';

// hooks
import useCommunity from '@/hooks/useCommunity';
import { useMagicLinkSignInState } from '@/app/[locale]/auth/login/MagicLinkSignInButton.client';
import { useSearchParams, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  setEmail as _setEmail,
  setErrorMessage as _setErrorMessage,
} from '@/redux/features/authSlice';

// constants
import { Community } from '@/data/services/fetchCommunityService';
import assets, { ButtonID } from '@/constants';
import colors from '@/styles/colors.config';
import routes from '@/routes/routes';

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

  // @dev this flow wold be abandoned
  // This is for the case when the user is redirected from the old MBTI test page
  if (
    searchParams.get('ismbti') &&
    searchParams.get('formsessionid') &&
    searchParams.get('directsend')
  ) {
    return (
      <MootiezOnBoardLogin
        community={community}
        searchParams={searchParams}
        nexturl={nexturl}
        loginurl={loginurl}
      />
    );
  }

  return (
    <DefaultLogin
      community={community}
      searchParams={searchParams}
      nexturl={nexturl}
      loginurl={loginurl}
    />
  );
};

const LOGIN_BACKGROUND = `
radial-gradient(67.44% 142.74% at 0% 100%, #FCD5C8 0%, rgba(252, 213, 200, 0.1) 100%) ,
radial-gradient(69.71% 143.67% at 100% 100%, rgba(157, 173, 255, 0.7) 0%, rgba(157, 173, 255, 0.1) 100%) ,
radial-gradient(50% 117.29% at 100% 2.21%, #87E4F9 0%, rgba(135, 228, 249, 0.1) 100%) ,
radial-gradient(50% 116.78% at 0% 0%, rgba(234, 89, 165, 0.5) 0%, rgba(234, 89, 165, 0.1) 100%) ,
#FFFFFF;
`;
const DefaultLogin: React.FC<{
  community: Community;
  searchParams: URLSearchParams;
  nexturl: string;
  loginurl: string;
}> = ({ community, searchParams, nexturl, loginurl }) => {
  return (
    <Scaffold
      appbar={
        <AppBar mainIcon={<AppIcon iconImageUrl={community.logo_url} />} />
      }
      sx={{
        background: LOGIN_BACKGROUND,
        '& header': {
          backgroundColor: 'transparent !important',
        },
      }}
      mainBody={
        <MainBody
          sx={{
            background: 'transparent',
            paddingX: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <>
            <Box paddingTop={'60px'} />
            <Box
              sx={{
                // backgroundColor: 'white',
                overflow: 'hidden',
              }}
            >
              <Image
                className={style.floating}
                src={assets.images.auth.login}
                alt={'login-image'}
                width={343}
                height={228}
                style={{
                  width: '343px',
                  height: '228px',
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
                priority
              />
            </Box>
            <Box paddingTop={'16px'} />

            {/* <div className="tw-h-[1.2vh]" aria-hidden="true"></div> */}
            {/* <div className="title-large tw-text-neutralSwatch-30 tw-text-center">
              Welcome to Mootiez
            </div> */}
            {/* <div className="tw-h-[1.2vh]" aria-hidden="true"></div> */}
            <Box paddingTop={'16px'} />

            <GoogleSignInButton nexturl={nexturl} loginurl={loginurl} />
            {/* <DividerWithText text="or continue with" /> */}
            <Divider
              sx={{
                marginY: '16px',
                border: '1px solid',
                borderColor: colors.neutralSwatch.main[80],
                width: '100%',
              }}
            />
            <EmailTextField />
            <div className="tw-h-[1.2vh]" aria-hidden="true"></div>
            <TnCCheckbox />
            <div className="tw-h-[1.2vh]" aria-hidden="true"></div>
            <MagicLinkSignInButton
              nexturl={nexturl}
              loginurl={loginurl}
              templateId={
                searchParams.get('ismbti') ? 'mootiez-onboard' : 'mootiez-login'
              }
            />
            <div className="tw-h-[2vh]" aria-hidden="true"></div>
          </>
        </MainBody>
      }
    />
  );
};

const MootiezOnBoardLogin: React.FC<{
  community: Community;
  searchParams: URLSearchParams;
  nexturl: string;
  loginurl: string;
}> = ({ community, searchParams, nexturl, loginurl }) => {
  const {
    email,
    agreedToTerms,
    errorMessage,
    successMessage,
    resendCountDown,
    isLoading,
    handleButtonClick,
  } = useMagicLinkSignInState({
    nexturl,
    templateId: 'mootiez-onboard',
  });
  const [firstEmailSent, setFirstEmailSent] = React.useState(false);
  const dispatch = useAppDispatch();
  const setEmail = (value: string) => {
    dispatch(_setEmail(value));
  };

  useEffect(() => {
    const _email = searchParams.get('email');
    if (_email !== null) {
      setEmail(_email);
    }

    if (email === _email && resendCountDown === 0 && !firstEmailSent) {
      console.log('send magiclink');
      handleButtonClick({ goToWaiting: false });
      setFirstEmailSent(true);
    }
  }, [searchParams.get('email'), email, firstEmailSent]);

  let displayContent = <></>;
  if (isLoading) {
    displayContent = (
      <CircularProgress size={20} sx={{ color: colors.white }} />
    );
  } else if (resendCountDown > 0) {
    displayContent = <>Resend ({resendCountDown})</>;
  } else {
    displayContent = <>Resend</>;
  }

  return (
    <SoftFusionScafford
      iconUrl={community.logo_url}
      loginImageUrl={assets.deprecated.loginHeroSqaured}
      mainContent={
        <>
          <div className="tw-pt-[4vh]" aria-hidden="true"></div>
          <div className="title-large tw-text-neutralSwatch-10 tw-text-center">
            Just One More Step Ahead!
          </div>
          <div className="title-large tw-text-neutralSwatch-10 tw-text-center">
            Check Your Email
          </div>
          <div className="tw-pt-[1.2vh]" aria-hidden="true"></div>
          <div className="body-large tw-text-neutralSwatch-30 tw-text-center">
            We just sent your result to
          </div>
          <div className="tw-pt-[2.5vh]" aria-hidden="true"></div>
          <div className="title-large tw-text-primarySwatch-40 tw-text-center">
            {email}
          </div>
          <div className="tw-pt-[2.5vh]" aria-hidden="true"></div>
          <Box
            sx={{
              backgroundColor: colors.primarySwatch.main[98],
              padding: '12px',
              borderRadius: '8px',
              gap: '24px',
            }}
          >
            <div className="body-large tw-text-neutralSwatch-30 tw-text-center">
              Please check your email inbox and click the{' '}
              <span className="tw-text-primarySwatch-40">“Claim here”</span>{' '}
              button in the email to continue!
            </div>
          </Box>
          <div className="tw-pt-[4vh]" aria-hidden="true"></div>
          <Box
            sx={{
              width: '254px',
            }}
          >
            <>
              <Button
                id={ButtonID.emailLogin}
                onClick={() => handleButtonClick({ goToWaiting: false })}
                fullWidth
                variant="contained"
                disabled={
                  isLoading ||
                  !email.trim() ||
                  !agreedToTerms ||
                  resendCountDown > 0
                }
              >
                {displayContent}
              </Button>
            </>
          </Box>
          <div className="tw-pt-[4vh]" aria-hidden="true"></div>
        </>
      }
    />
  );
};

export default Page;
