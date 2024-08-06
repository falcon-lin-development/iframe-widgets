'use client';

import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import LoadingPage from '@/components/loadingComponents/LoadingPageTransition';
import { Quest } from '@/data/services/fetchCommunityQuestsService';
import routes from '@/routes/routes';
import React, { useEffect } from 'react';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import { Button } from '@mui/material';

type Props = {
  quest: Quest;
};

const BackAndRedirectPage: React.FC<Props> = ({ quest }) => {
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const { navigate } = useAppRouting();
  const {
    utils: { getBearerToken },
  } = useDGAuth();
  const constructUrlWithParams = (
    baseUrl: string,
    params: Record<string, string>,
  ): string => {
    // Create a URL object
    const url = new URL(baseUrl);

    // Create URLSearchParams object from the params
    const searchParams = new URLSearchParams();

    // Add each key-value pair from params to the searchParams
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });

    // Set the searchParams to the URL
    url.search = searchParams.toString();

    // Return the URL as a string
    return url.toString();
  };

  const backAndRedirect = async (url?: string) => {
    if (url) {
      const newWindow = window.open(
        constructUrlWithParams(url, {
          email: (await getBearerToken()).email,
          personaid: communityProfile.persona_id,
        }),
        '_blank',
      );

      if (newWindow) {
        navigate(routes.c.journeys._home);
      }
    }
  };

  useEffect(() => {
    if (communityProfile.persona_id) {
      backAndRedirect(quest?.quest_content?.target_url as string);
    }
  }, [communityProfile]);

  return (
    <Scaffold
      appbar={<AppBar title="Redirecting..." backButton={<BackIconButton />} />}
      mainBody={
        <MainBody>
          <Button
            onClick={() => {
              backAndRedirect(quest?.quest_content?.target_url as string);
            }}
          >
            click here to the quiz...
          </Button>
        </MainBody>
      }
    />
  );
};

export default BackAndRedirectPage;
