'use client';
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import ErrorPage from '@/components/loadingScreens/Error';
import Step0Page from './0.name';
import Step1Page from './1.mbti';
import Step2Page from './2.pronouns';
import Step3Page from './3.bio';
import Step4Page from './4.links';
import Step5Page from './5.loading';
import Step6Page from './6.result';

// state
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';

// hooks
import useCommunity from '@/hooks/useCommunity';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  setUserName,
  setUserHandle,
  setEI,
  setSN,
  setTF,
  setJP,
  setPronouns,
  setBio,
  addLink,
  removeLinkByIndex,
  setLinkByIndex,
} from '@/redux/features/flows/onBoardingSlice';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { onBoardingCreateProfile } from '@/data/services/onBoardingService';
import { useSearchParams } from 'next/navigation';
import useSearchParamsMap from '@/utils/useSearchParamsMap.client';
import { useAuthRouterStates } from '@/app/providers/AuthRouterStatesContextProvider';
import { executeGraphQL } from '@/app/api/executeGraphQL';
import {
  CREATE_PROFILE_QUERY,
  CreateProfileResponse,
} from '@/app/api/create-public-profile/responseSchema';
import { useMutation } from 'urql';
import { useMainClient } from '@/app/providers/GraphQLProvider';

// create profile

export const _useOnboardingPageState = () => {
  const { searchParamsMap } = useSearchParamsMap();
  const dispatch = useAppDispatch();
  const { community } = useCommunity();
  const [personaId, setPersonaId] = React.useState<string | null>(null);
  const MAX_STEPS = 6; // @dev start from 0
  const [step, setStep] = React.useState(0);

  // fields
  const name = useAppSelector((state) => state.onBoardingSlice.value.userName);
  const _setName = (value: string) => dispatch(setUserName(value));
  const userHandle = useAppSelector(
    (state) => state.onBoardingSlice.value.userHandle,
  );
  const _setUserHandle = (value: string) => dispatch(setUserHandle(value));
  const ei = useAppSelector((state) => state.onBoardingSlice.value.ei);
  const _setei = (value: 'E' | 'I') => dispatch(setEI(value));
  const sn = useAppSelector((state) => state.onBoardingSlice.value.sn);
  const _setsn = (value: 'S' | 'N') => dispatch(setSN(value));
  const tf = useAppSelector((state) => state.onBoardingSlice.value.tf);
  const _settf = (value: 'T' | 'F') => dispatch(setTF(value));
  const jp = useAppSelector((state) => state.onBoardingSlice.value.jp);
  const _setjp = (value: 'J' | 'P') => dispatch(setJP(value));
  const pronouns = useAppSelector(
    (state) => state.onBoardingSlice.value.pronouns,
  );
  const _setPronouns = (value: string) => dispatch(setPronouns(value));
  const bio = useAppSelector((state) => state.onBoardingSlice.value.bio);
  const _setBio = (value: string) => dispatch(setBio(value));
  const links = useAppSelector((state) => state.onBoardingSlice.value.links);
  const _addLink = (value: { title: string; url: string }) =>
    dispatch(addLink(value));
  const _removeLinkByIndex = (value: number) =>
    dispatch(removeLinkByIndex(value));
  const _setLinkByIndex = (value: {
    title: string;
    url: string;
    index: number;
  }) => dispatch(setLinkByIndex(value));

  const {
    utils: { getBearerToken },
  } = useDGAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [createProfileError, setCreateProfileError] = React.useState<
    string | null
  >(null);

  const [createProfileResult, createProfileMutation] =
    useMutation<CreateProfileResponse>(CREATE_PROFILE_QUERY);
  // const _client =
  const { client } = useMainClient();

  useEffect(() => {
    if (personaId) {
      // @dev redirect to the next page
      setStep(6); // success
    }
  }, [personaId]);

  return {
    state: {
      community,
      personaId,
      step,
      isSubmitting,
      createProfileError,
      name,
      userHandle,
      ei,
      sn,
      tf,
      jp,
      currentMBTI: `${ei}${sn}${tf}${jp}`,
      pronouns,
      bio,
      links,
    },
    actions: {
      setName: _setName,
      setUserHandle: _setUserHandle,
      setei: _setei,
      setsn: _setsn,
      settf: _settf,
      setjp: _setjp,
      setPronouns: _setPronouns,
      setBio: _setBio,
      addLink: _addLink,
      removeLinkByIndex: _removeLinkByIndex,
      setLinkByIndex: _setLinkByIndex,
      goNext: () => {
        const _nextStep = Math.min(MAX_STEPS, step + 1);
        setStep(_nextStep);
      },
      goBack: () => {
        const _previousStep = Math.max(0, step - 1);
        setStep(_previousStep);
      },
      submitAndCreateProfile: async () => {
        // @dev create profile
        try {
          setIsSubmitting(true);
          setStep(5); // loading page
          //@ dev convert params to dictionary

          const authToken = (await getBearerToken()).jwtToken;

          const createProfile = await client.query(CREATE_PROFILE_QUERY, {
            userName: name,
            bio: bio,
            channel: searchParamsMap.channel || '',
            httpReferer: searchParamsMap.http_referer || '',
            referralCode: searchParamsMap.referral_code || '',
          });
          console.log('createResult:', createProfile);
          if (
            createProfile.data?.getOrJoinCommunityProfile?.error ||
            createProfile.error
          ) {
            console.log(createProfile.data?.getOrJoinCommunityProfile.message);
            throw new Error(
              createProfile.data?.getOrJoinCommunityProfile.message,
            );
          }

          // @dev call service
          const result = await onBoardingCreateProfile(
            {
              userName: name,
              userHandle: userHandle,
              bio,
              pronouns,
              ei,
              sn,
              tf,
              jp,
              links,
            },
            searchParamsMap,
            authToken,
          );
          console.log('onBoardingCreateProfile result:', result);
          if (result.status === 200) {
            // @dev redirect to the next page
            // setStep(6); // success page
            const personaId = result.data.personaId;
            setPersonaId(personaId);
          } else {
            setStep(4); // if error back to previous page
          }
        } catch (e) {
          console.log('onBoardingCreateProfile error: ', e);
          setStep(4); // if error back to previous page
        } finally {
          setIsSubmitting(false);
        }
      },
      setCreateProfileError,
    },
  };
};

const OnboardingFlowPage: NextPage = () => {
  const _onBoardingPageState = _useOnboardingPageState();
  const {
    hooks: { communityProfileHook },
    state: { isAuthenticated, isJoinedCommunity },
  } = useAuthRouterStates();
  const { navigate } = useAppRouting();
  const currentStep = _onBoardingPageState.state.step;

  useEffect(() => {
    if (isJoinedCommunity) {
      alert('You have already joined the community');
      navigate(routes.c.profile._home);
    }
  }, [isJoinedCommunity]);

  if (currentStep === 0) {
    return <Step0Page state={_onBoardingPageState} />;
  } else if (currentStep === 1) {
    return <Step1Page state={_onBoardingPageState} />;
  } else if (currentStep === 2) {
    return <Step2Page state={_onBoardingPageState} />;
  } else if (currentStep === 3) {
    return <Step3Page state={_onBoardingPageState} />;
  } else if (currentStep === 4) {
    return <Step4Page state={_onBoardingPageState} />;
  } else if (currentStep === 5) {
    return <Step5Page state={_onBoardingPageState} />;
  } else if (currentStep === 6) {
    return <Step6Page state={_onBoardingPageState} />;
  }

  return ErrorPage({ error: 'Unknown Step' });
};

export default OnboardingFlowPage;
