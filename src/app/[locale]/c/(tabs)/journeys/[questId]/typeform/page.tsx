'use client';

import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import LoadingPage from '@/components/loadingComponents/LoadingPageTransition';
import { ButtonID } from '@/constants';
import { Quest } from '@/data/services/fetchCommunityQuestsService';
import useCommunity from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import useCommunityQuests from '@/hooks/useCommunityQuests';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { Widget } from '@typeform/embed-react';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  params: { questId: string };
};

const Page: React.FC<Props> = ({ params: { questId } }) => {
  const { community } = useCommunity();
  const { communityProfile } = useCommunityProfile(community);
  const { communityQuests } = useCommunityQuests(community);

  const { logButtonClick } = useLogEvent();
  const {
    utils: { getBearerToken },
  } = useDGAuth();
  const [email, setEmail] = useState<string>('');
  const quest = useMemo(() => {
    if (!communityQuests.quests) {
      return null;
    } else {
      return communityQuests.quests.find((quest) => quest.quest_id === questId);
    }
  }, [communityQuests]);

  useEffect(() => {
    console.log(quest);
    console.log(questId);
  }, [quest]);

  // get email from DGAuth
  useEffect(() => {
    getBearerToken().then((token) => {
      setEmail(token.email);
    });
  }, []);

  const handleResponse: ((event: any) => void) | undefined = async (event) => {
    //console.log(event);
    // Persist response to Storage via API
    if (event?.responseId !== undefined) {
      const responseId = event.responseId;
      logButtonClick(ButtonID.quests.typeform.submit, responseId);
    }
  };

  const MyComponent = () => {
    return (
      <Widget
        id={(quest?.quest_content?.target_url as string).replace(
          'https://amrxq7a69ln.typeform.com/to/',
          '',
        )}
        style={{
          width: '100%',
          height: '100svh',
        }}
        className="my-form"
        hidden={{
          email: email,
          personaid: communityProfile.persona_id,
        }}
        onSubmit={handleResponse}
      />
    );
  };

  if (!email || !communityProfile.persona_id || !quest) {
    return <LoadingPage />;
  }

  return (
    <>
      <MyComponent />
    </>
  );
};

export default Page;
