'use client';
import { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import AppearanceTab from './3.AppearanceTab';
import LinksTab from './2.LinksTab';
import ShowroomTab from './1.ShowRoomTab.client';
import AboutMeTab from './0.AboutMeTab';

// skeleton
import LoadingPage from '@/components/loadingScreens/LoadingPage';
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import MainBody from '@/components/MainBody';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import TabSection, { TabPanel } from '@/components/TabSection';

// components
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Snackbar,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Eye } from 'lucide-react';
import PreviewPage from './PreviewPage';

// model
import colors from '@/styles/colors.config';

// hooks
import { useFixedPos } from '@/utils/usePosition';
import { useEditProfilePageState } from './useEditProfilePageState';

const Page: NextPage = () => {
  const _editProfilePageState = useEditProfilePageState();
  const {
    state: {
      // state
      isEditProfilePageInit,
      isSaving,
      // community / profile
      community,
      communityProfile,
      communityProfilePagePublic,
      userAttributes,
      //  edited profile
      editedProfile,
      editedPagePublic,

      // dialogs
      errorMessage,
      openPreview,
      savedSnackbarOpen,
      isErrorDialogOpen,
    },
    actions: {
      // setters
      setEditedProfile,
      setEditedPagePublic,

      // actions
      saveProfile,
      setOpenPreview,
      setSavedSnackbarOpen,
      closeErrorDialog,
    },
  } = _editProfilePageState;
  const [value, setValue] = useState(0); // for tab index
  const { v } = useFixedPos({ right: 16 });

  if (!isEditProfilePageInit) {
    return <LoadingPage />;
  }

  return (
    <>
      <Scaffold
        appbar={
          <AppBar
            backButton={<BackIconButton />}
            title="Edit Profile"
            rightMostIcon={
              <LoadingButton
                disabled={Boolean(errorMessage) || isSaving}
                onClick={saveProfile}
                loading={isSaving}
              >
                <Typography
                  variant="labelLarge"
                  sx={{
                    transform: 'translateY(2px)',
                  }}
                >
                  Save
                </Typography>
              </LoadingButton>
            }
          />
        }
        mainBody={
          <MainBody>
            <Box paddingTop={'8px'} aria-label="spacer" />
            {/* Tabs / Tab contents */}
            <>
              <TabSection
                valueState={[value, setValue]}
                showContent={false}
                tabs={[
                  { label: 'About Me' },
                  { label: 'Display' },
                  { label: 'Links' },
                  { label: 'Background' },
                ]}
              />
              <TabPanel index={0} value={value} tabSectionType="bottom-nav">
                <AboutMeTab
                  editedProfile={editedProfile}
                  setEditedProfile={setEditedProfile}
                  sx={{
                    padding: '16px',
                  }}
                />
              </TabPanel>
              <TabPanel index={1} value={value} tabSectionType="bottom-nav">
                <ShowroomTab
                  originalAvatarUrl={communityProfile.profile_avatar_url}
                  editedProfile={editedProfile}
                  setEditedProfile={setEditedProfile}
                  editedPagePublic={editedPagePublic}
                  setEditedPagePublic={setEditedPagePublic}
                  userAttributes={userAttributes}
                  sx={{
                    padding: '16px',
                  }}
                />
              </TabPanel>
              <TabPanel index={2} value={value} tabSectionType="bottom-nav">
                <LinksTab
                  state={_editProfilePageState}
                  sx={{
                    padding: '16px',
                  }}
                />
              </TabPanel>
              <TabPanel index={3} value={value} tabSectionType="bottom-nav">
                <AppearanceTab
                  editedPagePublic={editedPagePublic}
                  setEditedPagePublic={setEditedPagePublic}
                  sx={{
                    padding: '16px',
                  }}
                />
              </TabPanel>
            </>
            {/* preview btn */}
            <>
              <Button
                variant="contained"
                startIcon={<Eye color={colors.primarySwatch.main[10]} />}
                sx={{
                  position: 'fixed',
                  bottom: 16,
                  right: v,
                  backgroundColor: colors.primarySwatch.main[90],
                  padding: '18px 20px',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: colors.primarySwatch.main[90],
                  },
                }}
                onClick={() => {
                  setOpenPreview(true);
                }}
              >
                <Typography
                  variant="labelLarge"
                  color={colors.primarySwatch.main[10]}
                  fontFamily={'Neue Metana'}
                  sx={{
                    transform: 'translateY(2px)',
                  }}
                >
                  Preview
                </Typography>
              </Button>
              {/* Preview Dialog */}
              <Dialog
                fullScreen
                open={openPreview}
                className="tw-max-w-mobile"
                sx={{
                  margin: 'auto',
                }}
              >
                <DialogContent
                  sx={{
                    padding: 0,
                  }}
                >
                  <PreviewPage
                    onClose={() => {
                      setOpenPreview(false);
                    }}
                    state={_editProfilePageState}
                  />
                </DialogContent>
              </Dialog>
            </>
            {/* Snackbars */}
            <>
              <Snackbar
                open={savedSnackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSavedSnackbarOpen(false)}
                message="All changes saved"
              />
              <Snackbar
                open={isErrorDialogOpen}
                autoHideDuration={6000}
                onClose={closeErrorDialog}
                message={errorMessage}
                action={
                  <Button
                    color="secondary"
                    size="small"
                    onClick={closeErrorDialog}
                  >
                    Close
                  </Button>
                }
              />
            </>
          </MainBody>
        }
      />
    </>
  );
};

export default Page;

// other components
