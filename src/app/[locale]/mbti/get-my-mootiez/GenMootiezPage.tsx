'use client';

// External libraries
import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

// Next.js related
import { NextPage } from 'next';

// Custom hooks
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useMBTIData from '@/hooks/useMBTIData';

// Redux features
import {
  getGender,
  getType,
  isMBTIDataValid,
} from '@/redux/features/mbti/mbtiSlice';

// Data services
import { genAvatar } from '@/data/services/GenAvatarService';
import { joinCommunity } from '@/data/services/JoinCommunityService';
import {
  NFT721MintingResponse,
  mintNFT721,
} from '@/data/services/MintNFTService';

// Components
import Scaffold from '@/components/scaffolds/Scaffold';
import MainBody from '@/components/MainBody';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MessageDialog from '@/components/dialogs/MessageDialog.client';

// App routing and utilities
import { useAuthRouterStates } from '../../../providers/AuthRouterStatesContextProvider';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
// constants
import {
  appendCommunityProfileStoredData,
  updateCommunityProfile,
} from '@/data/repositaries/CommunityProfileRepo';
import { resetAllState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hook';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { ButtonID } from '@/constants';
import { udpateSurveyResposnePersona } from '@/data/repositaries/SurveyJsRepo';
import { useSearchParams } from 'next/navigation';

const _useGenMootiez = () => {
  const [isError, setIsError] = useState(false);
  const [isGeneratingMootiez, setIsGeneratingMootiez] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { community } = useCommunity();
  // const { communityProfile } = useCommunityProfile(community);
  const { mbtiData } = useMBTIData();
  const {
    state: { isJoinedCommunity },
  } = useAuthRouterStates();
  const {
    utils: { getBearerToken },
  } = useDGAuth();
  const { navigate } = useAppRouting();
  const searchParams = useSearchParams();

  useEffect(() => {
    const genMootiez = async () => {
      const toBeRevealedImageKey = 'mootiez-to-be-revealed';
      let avatarUrl = '';
      try {
        const avatar = await genAvatar({
          mbtiType: getType(mbtiData),
          gender: getGender(mbtiData),
        });
        avatarUrl = avatar.avatarUrl || toBeRevealedImageKey;
      } catch (error) {
        avatarUrl = toBeRevealedImageKey;
        console.error('Unexpected error:', error);
      }

      try {
        const jwtToken = (await getBearerToken()).jwtToken;
        const _ = await joinCommunity({
          profile_avatar_url: avatarUrl,
          referral_code: mbtiData.referral_code || mbtiData.referralcode,
          channel: mbtiData.channel,
          http_referer: mbtiData.http_referer || mbtiData.httpreferer,
          community_id: community.community_id,
          profile_name: getType(mbtiData),
          accessToken: jwtToken,
        });

        mintNFT721({
          accessToken: (await getBearerToken()).jwtToken,
          image_url: avatarUrl,
          mbti: getType(mbtiData),
        })
          .then((response: NFT721MintingResponse) => {
            console.log('mintNFT721 response:', response);

            updateCommunityProfile({
              accessToken: jwtToken,
              communityId: community.community_id,
              profileAvatarUrl: response.image_url,
            })
              .then((_) => {
                console.log('updateCommunityProfile response:', _);
              })
              .catch((error) => {
                console.error('updateCommunityProfile error:', error);
              });
          })
          .catch((error) => {
            console.error('mintNFT721 error:', error);
          });

        // console.log('finished joining community', _);
        setIsGeneratingMootiez(false);
      } catch (error) {
        setIsError(true);
        setErrorMsg('Failed to join community');
        console.error('Unexpected error:', error);
        return;
      }

      try {
        // console.log('save mbti data to user stored data');

        // start generating Mootiez
        appendCommunityProfileStoredData(
          // async on purpuse
          {
            communityId: community.community_id,
            accessToken: (await getBearerToken()).jwtToken,
            userStoredData: {
              avatar_gen_time: Date.now(),
              mbti: mbtiData,
            },
          },
        );
        navigate(routes.mbti.mootiez_report);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    if (!isGeneratingMootiez) {
      /**
       * Check generate requirements:
       * 1/ Community Not Joined
       * 2/ Community Profile Not Created || Community Porfile.user_stored_data.avatar_gen_time === undefined/null
       * 3/ MBTI Data valid
       *
       * If all requirements are met, generate Mootiez
       * else show error page and message
       * */
      if (community === undefined) {
        setIsError(true);
        setErrorMsg('Community Not Found');
        return;
      }
      if (isJoinedCommunity === true) {
        setIsError(true);
        setErrorMsg('Community already Joined');
        return;
      }
      if (!isMBTIDataValid(mbtiData)) {
        setIsError(true);
        setErrorMsg('MBTI Data is not valid');
        return;
      }

      setIsGeneratingMootiez(true);
      genMootiez();
    }
  }, []);

  useEffect(() => {
    const _updateSurveyResponse = async () => {
      if (searchParams.get('formsessionid')) {
        await udpateSurveyResposnePersona({
          accessToken: (await getBearerToken()).jwtToken,
          formSessionId: searchParams.get('formsessionid')!,
        });
      }
    };
    _updateSurveyResponse();
  }, [searchParams.get('formsessionid')]);

  return {
    state: {
      isError,
      errorMsg,
    },
  };
};

const Page: NextPage = () => {
  const {
    utils: { dgSignOut },
  } = useDGAuth();
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [isConfirmedLogout, setIsConfirmedLogout] = useState<boolean>(false);
  const {
    state: { isError, errorMsg },
  } = _useGenMootiez(); // this also kick start the gen mootiez process
  const dispatch = useAppDispatch();
  const { logButtonClick } = useLogEvent();

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
                  logButtonClick(ButtonID.gen_mootiez.logout, 'login page');
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
            }}
          >
            {isError ? (
              <>
                <div className="body-large tw-text-neutralSwatch-30">
                  {errorMsg || 'Unexpected error'}
                </div>
              </>
            ) : (
              <>
                <CircularProgress />
                <div className="tw-pt-[3vh]" aria-label="spacer" />
                <div className="tw-pt-[1vh]" aria-label="spacer" />
                <div className="body-large tw-text-neutralSwatch-30">
                  Welcome!
                </div>
                <div className="body-large tw-text-neutralSwatch-30">
                  Your unique Mootiez is being generated.
                </div>
                <div className="tw-pt-[3vh]" aria-label="spacer" />

                <div className="body-small tw-text-neutralSwatch-50">
                  Waiting time: 5 - 20 s
                </div>
              </>
            )}
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
