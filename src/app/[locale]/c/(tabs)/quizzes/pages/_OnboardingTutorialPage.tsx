/**
 * This is the entry point to the community home page
 */
'use client';

import React, { useMemo } from 'react';
import { NextPage } from 'next';
import NormalPage from './CollectPage';

// models
import { Community } from '@/data/services/fetchCommunityService';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import { Quest } from '@/data/services/fetchCommunityQuestsService';

// components
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  Modal,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { Star, X } from 'lucide-react';
import Image from 'next/image';
import assets from '@/constants';
import colors from '@/styles/colors.config';

// hooks
import { useFixedPos } from '@/utils/usePosition';
import { NavBarIconButton } from '@/components/navbars/BottomNavBar.client';
import routes from '@/routes/routes';
import { CollectionTask } from '@/data/db/collect_tasks';
import HighLightedWidget from '@/components/badges/HighLightedWidget';
import { TaskHorizCard } from '@/components/cards/TaskHorizCard';
// import { Tutorials } from '@/data/graphql/models/PersonaCommunityProfile';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useWidth } from '@/utils/useWidth';
import TutorialBubble from '@/components/dialogs/TutorialBubble.client';

type Props = {
  community: Community;
  communityProfile: CommunityProfile;
  collectTasks: CollectionTask[];
};

const OnboardingTutorialPage: NextPage<Props> = ({
  community,
  communityProfile,
  collectTasks,
}) => {
  // @dev this maxWidth just for calculation easier when following figma design
  const { constructPath } = useAppRouting();
  const { v } = useFixedPos({ left: 16, maxWidth: 430 });
  const { windowWidth } = useWidth({ maxWidth: 430 });
  const personalityTask = collectTasks.find((task) =>
    task.id.toString().includes('mbti'),
  );

  if (!personalityTask?.id) {
    return <>error loading task</>;
  }

  return (
    <>
      <NormalPage
        community={community}
        communityProfile={communityProfile}
        collectTasks={collectTasks}
      />
      <Modal
        open={true}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="tw-max-w-mobile"
          height={'100%'}
          width={'100%'}
          margin="auto"
          sx={{
            ':focus-visible': {
              outline: 'none',
            },
          }}
        >
          <>
            <TutorialBubble
              image={assets.images.app.defaultAvatar}
              title={'Find Attribute'}
              content={
                'Discover your personality and collect it as an attribute now.'
              }
              sx={{
                height: '88px',
                width: '310px',
                borderRadius: '8px',
                padding: '16px',
                // position
                position: 'absolute',
                top: '244px',
                left: `${v}px`,
              }}
            />

            <HighLightedWidget
              sx={{
                // location
                position: 'absolute',
                top: '108px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '8px',
                maxWidth: `calc(${windowWidth}px - 24px)`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  padding: '4px',
                  width: '100vw',
                  backgroundColor: colors.primarySwatch.main[98],
                }}
              >
                <TaskHorizCard
                  task={personalityTask}
                  onClick={() => {}}
                  href={constructPath(routes.c.quizzes.detail._home, {
                    options: {
                      qid: personalityTask.id,
                    },
                    searchParams: {
                      // tutorial: Tutorials.ONBOARDING,
                    },
                  })}
                />
              </Box>
            </HighLightedWidget>
          </>
        </Box>
      </Modal>
    </>
  );
};

export default OnboardingTutorialPage;

// other components

// const FirstTaskHighlighted: React.FC<{
//   sx?: SxProps<Theme>;
// }> = ({ sx }) => {
//   return (
//     <>
//       <HighLightedWidget sx={sx}>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'row',
//             justifyContent: 'center',
//             borderRadius: '9999px',
//             overflow: 'hidden',
//             padding: '5px 1px',
//             backgroundColor: colors.primarySwatch.main[98],
//           }}
//         >
//           <TaskHorizCard

//           />
//         </Box>
//       </HighLightedWidget>
//     </>
//   );
// };
