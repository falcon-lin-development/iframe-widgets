'use client';
// Next.js related
import { NextPage } from 'next';

// Components
import AppBar from '@/components/appbars/AppBar';
import { Button, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import MootiezReportScaffold from './MootiezReportScaffold';

// App routing and utilities
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import routes from '@/routes/routes';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { ButtonID } from '@/constants';

const Page: NextPage = () => {
  const { logButtonClick } = useLogEvent();
  const { navigate } = useAppRouting();

  return (
    <>
      <MootiezReportScaffold
        // stickyAppBar={ <></>}
        inPageAppBar={
          <AppBar
            backButton={
              <IconButton
                onClick={() => {
                  logButtonClick(
                    ButtonID.mootiez_report.back_to_community,
                    'community-main-page',
                  );
                  navigate(routes.c._home);
                }}
              >
                <X />
              </IconButton>
            }
            title="Get My Mootiez"
            // rightMostIcon={<>
            //   <Button
            //     // variant="contained"
            //     color="primary"
            //     size="large"
            //     sx={{
            //       paddingX: '2rem',

            //       whiteSpace: 'nowrap',
            //     }}
            //     onClick={() => {
            //       logButtonClick(
            //         ButtonID.mootiez_report.enter_app,
            //         'community-main-page',
            //       );
            //       navigate(routes.c._home);
            //     }}
            //   >
            //     Explore more
            //   </Button>
            // </>}
            style={{
              height: '45px',
            }}
          />
        }
      />
    </>
  );
};

export default Page;
