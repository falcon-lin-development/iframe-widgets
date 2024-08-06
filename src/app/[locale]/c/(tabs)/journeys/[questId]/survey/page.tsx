/**
 * This page is for rendering surveyjs
 */
'use client';
import 'survey-core/defaultV2.min.css';

import { Model, ITheme } from 'survey-core';
import themeJson from './survey_theme.json';
import { Survey } from 'survey-react-ui';

import React, { useEffect, useCallback, useMemo } from 'react';
import { NextPage } from 'next';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useCommunityQuests from '@/hooks/useCommunityQuests';
import useCommunityQuestDetail from '@/hooks/useCommunityQuestDetail';

import LoadingPage from '@/components/loadingScreens/LoadingPage';
import Scaffold from '@/components/scaffolds/Scaffold';
import { Box } from '@mui/material';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';

type Props = {
  params: {
    locale: string;
    questId: string;
  };
};

const Page: NextPage<Props> = ({ params: { locale, questId } }) => {
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const { communityQuests } = useCommunityQuests(community);
  const { communityQuestDetail } = useCommunityQuestDetail(community, questId);

  const alertResults = useCallback((sender: { data: any }) => {
    const results = JSON.stringify(sender.data);
    alert(results);
  }, []);

  if (
    !community.community_id ||
    !communityProfile.community_id ||
    !(communityQuests.count >= 0) ||
    !communityQuestDetail?.quest?.quest_id
  ) {
    return <LoadingPage loadingText="Loading Survey Page..." />;
  }

  const survey = new Model(communityQuestDetail.content.contentObject);
  survey.onComplete.add(alertResults);
  survey.applyTheme(themeJson as ITheme);

  return (
    <Scaffold
      appbar={
        <AppBar
          title={communityQuestDetail.quest.quest_title}
          backButton={<BackIconButton />}
        />
      }
      mainBody={
        <MainBody
          style={{
            padding: '1rem',
            borderRadius: '1rem',
            overflow: 'hidden',
          }}
        >
          <Survey model={survey} />
        </MainBody>
      }
    />
  );
};

export default Page;
