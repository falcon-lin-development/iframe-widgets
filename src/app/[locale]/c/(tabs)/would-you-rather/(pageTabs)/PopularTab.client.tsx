'use client';

// Skeletons
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import TabSkeleton from '../components/TabSkeleton.client';

// components
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import WyrPostCard from '../components/postCard/WyrPostCard.client';

// hooks
import { usePageState } from '../pageStateContextProvider';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

const PopularTab: React.FC = () => {
  const {
    // const: {},
    state: { isInit, tabId, popularWyrState },
    actions: { setTabId, refreshPopularWyr, queryNextPopularWyr },
  } = usePageState();
  const { ref, inView, entry } = useInView({
    triggerOnce: false,
    threshold: 0.1, // Triggers when 10% of the element is visible
  });

  useEffect(() => {
    if (inView && Boolean(popularWyrState.data?.getPopularWyrList.lastId)) {
      queryNextPopularWyr();
    }
  }, [inView]);

  if (!isInit) {
    return <LoadingPage loadingText="loading community data" />;
  }

  return (
    <TabSkeleton value={tabId} setValue={setTabId}>
      <Stack
        spacing={1}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {popularWyrState.data?.getPopularWyrList.posts.map((post) => (
          <WyrPostCard
            key={post.postId}
            wyrPost={post}
            // voteState={voteState}
            // voteWyrPostById={voteWyrPostById}
          />
        ))}
        {/* {popularWyrState.fetching && <CircularProgress />} */}
      </Stack>
      <Divider sx={{ width: '90%', margin: '16px 0px' }} ref={ref}>
        <LoadingButton
          variant="text"
          loading={popularWyrState.fetching}
          onClick={() => queryNextPopularWyr()}
          disabled={!popularWyrState.data?.getPopularWyrList.lastId}
        >
          <Typography variant="bodySmall">
            {popularWyrState.data?.getPopularWyrList.lastId
              ? 'Load more '
              : 'End of the list'}
          </Typography>
        </LoadingButton>
      </Divider>
      <Box sx={{ paddingTop: '16px' }} aria-label="spacer"></Box>
    </TabSkeleton>
  );
};

export default PopularTab;
