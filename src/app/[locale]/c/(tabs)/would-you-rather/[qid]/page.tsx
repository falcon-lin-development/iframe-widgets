'use client';
import { NextPage } from 'next';

// components
import ScrollingSection from '../components/ScollingSection/ScrollingSection';
import PublicScrollingSection from '../components/ScollingSection/ScrollingSection.public';
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import BottomInputBar from '../components/ScollingSection/BottomInputBar.client';

// types
import { WyrPost } from '../graphql/models/WyrPost';
import routes from '@/routes/routes';

// hooks
import GameContextByIdProvider, {
  useGameContext,
} from './GameContextByIdProvider';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useSearchParams } from 'next/navigation';

type PageProps = {
  params: {
    locale: string;
    qid: string;
  };
  // searchParams: { [key: string]: string | string[] | undefined }
};

// const _usePageState = (qid: string) => {
//   const {
//     state: { wyrPostState },
//   } = useGetWyrPostById(qid);
//   const {
//     state: { isAuthenticated, isJoinedCommunity },
//   } = useAuthRouterStates();
//   const { navigate } = useAppRouting();

//   // if not join but authenticated, redirect to join
//   useEffect(() => {
//     if (isAuthenticated && isJoinedCommunity === false) {
//       navigate(routes.c.join);
//     }
//   }, [isAuthenticated, isJoinedCommunity]);

//   return {
//     wyrPost: wyrPostState.data?.getWyrPost,
//     isAuthenticated,
//     init: wyrPostState.data?.getWyrPost.postId && isAuthenticated !== null,
//   };
// };

const Page: NextPage<PageProps> = ({ params: { locale, qid } }) => {
  // const { wyrPost, init, isAuthenticated } = _usePageState(qid);

  // if (!init) {
  //   return <LoadingPage/>;
  // }

  return (
    <GameContextByIdProvider wyrPostId={qid}>
      <PageContent />
    </GameContextByIdProvider>
  );
};

const PageContent: React.FC = () => {
  const gameStateContext = useGameContext();
  const wyrPost = gameStateContext.additional.wyrPost;
  const { constructPath } = useAppRouting();
  const param = useSearchParams();

  if (!gameStateContext.additional.isAuthenticated) {
    return <PublicScrollingSection wyrPost={wyrPost!} />;
  }

  return (
    <ScrollingSection
      wyrPost={wyrPost}
      gameContext={gameStateContext.gameContext}
      otherProps={{
        backUrl: constructPath(routes.c.would_you_rather._home, {
          searchParams: {
            tabId: param.get('tabId') || '0',
          },
        }),
      }}
      bottomInputBar={
        <BottomInputBar
          gameContext={gameStateContext.gameContext}
          wyrPost={wyrPost}
        />
      }
    />
  );
};

export default Page;
