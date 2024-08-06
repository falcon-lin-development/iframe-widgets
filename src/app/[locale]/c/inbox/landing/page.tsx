'use client';
import { NextPage } from 'next';

// components
import AppBar from '@/components/appbars/AppBar';
import InboxScaffold from '../components/InboxScaffold.client';
import { X } from 'lucide-react';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { IconButton } from '@mui/material';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { ButtonID } from '@/constants';

const Page: NextPage = () => {
  const { navigate } = useAppRouting();
  const { logButtonClick } = useLogEvent();
  return (
    <>
      <InboxScaffold
        appbar={
          <AppBar
            backButton={
              <IconButton
                sx={{}}
                onClick={() => {
                  logButtonClick(
                    ButtonID.inbox.landing_back,
                    'community-main-page',
                  );
                  navigate(routes.c._home);
                }}
              >
                <X size={24} />
              </IconButton>
            }
            title="Inbox"
          />
        }
      />
    </>
  );
};

export default Page;
