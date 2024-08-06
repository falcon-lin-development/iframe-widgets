'use client';
import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import assets from '@/constants';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import colors from '@/styles/colors.config';
import AddQuestionDialog from '../components/gameScene/addQuestion/AddQuestionDialog';
import ShareQuestionDialog from '../components/gameScene/addQuestion/ShareQuestionDialog';
import TabSkeleton from '../components/TabSkeleton.client';

// states
import { usePageState } from '../pageStateContextProvider';
import {
  CreateWyrPostProvider,
  useCreateWyrPost,
  CreateWyrPostParams,
  CreateWyrPostResponse,
} from '../graphql/createWyrPostContextProvider';
import useCommunity from '@/hooks/useCommunity';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import { AnyVariables, UseMutationState } from 'urql';
import { WyrPost, isWyrPost } from '../graphql/models/WyrPost';
import { WyrSummaryCard } from '../components/postCard/WyrSummaryCard.horizontal';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { Plus } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';

const YoursTab: React.FC = () => {
  const {
    state: { isInit, community },
  } = usePageState();

  if (!isInit) {
    return <LoadingPage loadingText="loading community data" />;
  }

  return (
    <CreateWyrPostProvider community={community}>
      <YoursTabComponent />
    </CreateWyrPostProvider>
  );
};

const YoursTabComponent: React.FC = () => {
  // Create Wyr Post
  const { createWyrPostState, createWyrPost } = useCreateWyrPost();
  // Share Dialog
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  // Create Wyr Post Dialog
  const [createWyrPostDialogOpen, setCreateWyrPostDialogOpen] =
    React.useState(false);
  // navigation

  const {
    // const: {},
    state: { tabId, yoursWyrState },
    actions: { setTabId, refreshYoursWyr, queryNextYoursWyr },
  } = usePageState();

  const yoursWYRs = useMemo(() => {
    if (yoursWyrState.data) {
      return yoursWyrState.data.getYourWyrList.posts.filter((wyrPost) => {
        const _isValid = isWyrPost(wyrPost);
        if (!_isValid.isValid) {
          console.log(`YoursTab: ${_isValid.error}`, wyrPost);
        }
        return _isValid.isValid;
      });
    } else {
      return [];
    }
  }, [yoursWyrState]);

  return (
    <>
      <TabSkeleton value={tabId} setValue={setTabId}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0px 16px 16px 16px',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.neutralSwatch.main[10],
            width: '100%',
            gap: '16px',
          }}
        >
          {/* has yours */}
          {yoursWYRs.length > 0 && (
            <HasWyrPostComponent
              yoursWYRs={yoursWYRs}
              setCreateWyrPostDialogOpen={setCreateWyrPostDialogOpen}
              createWyrPostState={createWyrPostState}
            />
          )}

          {/* no yours */}
          {yoursWYRs.length === 0 && yoursWyrState.fetching && (
            <CircularProgress size={12} />
          )}
          {yoursWYRs.length === 0 && !yoursWyrState.fetching && (
            <NoWyrPostComponent
              setCreateWyrPostDialogOpen={setCreateWyrPostDialogOpen}
              createWyrPostState={createWyrPostState}
            />
          )}
        </Box>
      </TabSkeleton>
      <AddQuestionDialog
        open={createWyrPostDialogOpen}
        onConfirm={(input: CreateWyrPostParams) => {
          createWyrPost(input).then((result) => {
            if (result?.data) {
              console.log('Mutation successful', result.data);
              setCreateWyrPostDialogOpen(false);
              setShareDialogOpen(true);
            } else {
              console.error('Mutation error', result?.error);
            }
          });
        }}
        onClose={(isConfirmed, data) => {
          setCreateWyrPostDialogOpen(false);
        }}
      />
      <ShareQuestionDialog
        open={shareDialogOpen}
        onClose={(action: boolean, data) => {
          setShareDialogOpen(false);
        }}
      />
    </>
  );
};

export default YoursTab;

// other components
const HasWyrPostComponent: React.FC<{
  yoursWYRs: WyrPost[];
  setCreateWyrPostDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createWyrPostState: UseMutationState<CreateWyrPostResponse, AnyVariables>;
}> = ({ yoursWYRs, setCreateWyrPostDialogOpen, createWyrPostState }) => {
  const { constructPath } = useAppRouting();
  const param = useSearchParams();

  const {
    // const: {},
    state: { tabId, yoursWyrState },
    actions: { setTabId, refreshYoursWyr, queryNextYoursWyr },
  } = usePageState();
  const { ref, inView, entry } = useInView({
    triggerOnce: false,
    threshold: 0.1, // Triggers when 10% of the element is visible
  });

  useEffect(() => {
    if (inView && Boolean(yoursWyrState.data?.getYourWyrList.lastId)) {
      queryNextYoursWyr();
    }
  }, [inView]);

  const v = useMemo(() => {
    // only work at initial render
    const viewportWidth = Math.min(window.innerWidth, 430); // Width of the viewport in pixels
    // 24 is the padding of the parent container
    // 135 is the width of the button
    const value = (viewportWidth - 32 - 135) / 2;
    return value;
  }, []);

  return (
    <>
      <Stack
        spacing={2}
        sx={{
          width: '100%',
        }}
      >
        {yoursWYRs.map((wyr, index) => {
          return (
            <WyrSummaryCard
              key={index}
              wyrPost={wyr}
              sx={{
                width: '100%',
              }}
              href={constructPath(routes.c.would_you_rather.detail._home, {
                options: {
                  qid: wyr.postId,
                },
                searchParams: {
                  tabId: '2',
                },
              })}
            />
          );
        })}
      </Stack>
      <Divider sx={{ width: '100%', margin: '0' }} ref={ref}>
        <LoadingButton
          variant="text"
          loading={yoursWyrState.fetching}
          onClick={() => queryNextYoursWyr()}
          disabled={!yoursWyrState.data?.getYourWyrList.lastId}
        >
          <Typography variant="bodySmall">
            {yoursWyrState.data?.getYourWyrList.lastId
              ? 'Load more '
              : 'End of the list'}
          </Typography>
        </LoadingButton>
      </Divider>
      <Box
        sx={{
          position: 'fixed',
          bottom: '72px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignContent: 'center',
          transform: `translateX(${v}px)`,
          // backgroundColor: colors.neutralSwatch.main[10],
        }}
        className={`tw-max-w-mobile`}
      >
        <LoadingButton
          variant="text"
          sx={{
            width: '135px',
            height: '56px',
            padding: '16px 16px 16px 16px',
            borderRadius: '8px',
            backgroundColor: colors.neutralSwatch.main[95],
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
            // marginRight: '16px',

            '&:hover': {
              backgroundColor: colors.neutralSwatch.main[90],
            },
          }}
          loading={createWyrPostState.fetching}
          onClick={() => setCreateWyrPostDialogOpen(true)}
          startIcon={<Plus />}
        >
          <Typography
            variant="labelLarge"
            sx={{
              transform: 'translateY(2px)',
            }}
          >
            Create
          </Typography>
        </LoadingButton>
      </Box>
    </>
  );
};

const NoWyrPostComponent: React.FC<{
  setCreateWyrPostDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createWyrPostState: UseMutationState<CreateWyrPostResponse, AnyVariables>;
}> = ({ setCreateWyrPostDialogOpen, createWyrPostState }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src={assets.images.wyr.yours.display}
        alt="Yours"
        width={500}
        height={500}
        priority
      />
      <Box sx={{ paddingTop: '24px' }} aria-label="spacer"></Box>
      <Typography variant="titleMedium" sx={{ textAlign: 'center' }}>
        Know What The Others Feel!{' '}
      </Typography>
      <Box sx={{ paddingTop: '8px' }} aria-label="spacer"></Box>
      <Typography variant="bodyMedium" sx={{ textAlign: 'center' }}>
        Create your question to ask thousands of Mootiez.{' '}
      </Typography>
      <Box sx={{ paddingTop: '24px' }} aria-label="spacer"></Box>
      <LoadingButton
        variant="contained"
        sx={{
          padding: '10px 81px',
          boxShadow: 'none',
        }}
        onClick={() => setCreateWyrPostDialogOpen(true)}
        loading={createWyrPostState.fetching}
        // onClick={() => setShareDialogOpen(true)}
      >
        <Typography variant="labelLarge">Create Now</Typography>
      </LoadingButton>
      <Box sx={{ paddingTop: '24px' }} aria-label="spacer"></Box>
    </Box>
  );
};
