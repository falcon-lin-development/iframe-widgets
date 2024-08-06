// Next

// Skeletons
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import { usePageState } from '../pageStateContextProvider';
import GameMenuScene from '../components/gameScene/GameMenuScene';

const RandomTab: React.FC = () => {
  const {
    state: { isInit, gameState, tabId },
    actions: { setTabId },
  } = usePageState();
  if (!isInit) {
    return <LoadingPage loadingText="loading community data" />;
  }

  return <GameMenuScene state={gameState} value={tabId} setValue={setTabId} />;
};

export default RandomTab;
