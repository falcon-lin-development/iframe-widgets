'use client';
import { NextPage } from 'next';
import { Quest, QuestType } from '@/data/services/fetchCommunityQuestsService';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useCommunityQuests from '@/hooks/useCommunityQuests';
import QuestPageScaffold from '../QuestPageScaffold';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import InviteDelusionIndexSurveySection from '@/app/[locale]/mbti/mootiez-report/InviteDelusionIndexSurveySection';
import SocialShareSection from '@/app/[locale]/mbti/mootiez-report/SocialShareSection';
import { Box, Typography } from '@mui/material';
import colors from '@/styles/colors.config';
import { ButtonID } from '@/constants';
type Props = {
  quest: Quest;
};

const Page: NextPage<Props> = ({ quest }) => {
  const { community, communityPathId } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const { communityQuests } = useCommunityQuests(community);

  if (
    !community.community_id ||
    !communityProfile.community_id ||
    !(communityQuests.count >= 0)
  ) {
    return <LoadingPage loadingText="Loading Explore Data..." />;
  }

  if (quest.quest_type === QuestType.share) {
    return (
      <QuestPageScaffold
        communityQuests={communityQuests}
        quest={quest}
        questDetailTitle={
          'invite your friends to complete a review of how you are like with them!'
        }
      >
        <InviteDelusionIndexSurveySection
          referral_code={communityProfile.own_referral_code}
        />
      </QuestPageScaffold>
    );
  } else if (quest.quest_type === QuestType.myreport) {
    return (
      <QuestPageScaffold
        communityQuests={communityQuests}
        quest={quest}
        questDetailTitle={'share Mootiez with friends'}
        questDescription={
          "invite your friends to join Mootiez! Let's grow Mootiez together. we are also hoping to turn on some social features soon..."
        }
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            padding: '24px 12px 12px 12px',
            bgcolor: colors.primarySwatch.main[98],
          }}
        >
          <Typography
            variant="titleLarge"
            color={colors.primarySwatch.main[40]}
          >
            LET'S GROW MOOTIEZ
          </Typography>
          <Box sx={{ height: '16px' }} />

          <SocialShareSection
            title={
              'Hey! \n\nTake this MBTI test and share your result with me.😆'
            }
            url={`${'https://mootiez.com/'}?referralcode=${communityProfile.own_referral_code}`}
            iconSize={32}
            shareAction={ButtonID.social_share.invite_join_mootiez}
            copyAction={ButtonID.social_share.copy_to_clipboard_invite}
          />
        </Box>
      </QuestPageScaffold>
    );
  }

  return <>{quest.quest_category}</>;
};

export default Page;
