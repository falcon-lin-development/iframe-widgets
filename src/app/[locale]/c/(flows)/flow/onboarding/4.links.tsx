'use client';
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { _useOnboardingPageState } from './OnboardingFlowPage';

// Skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import MessageDialog, {
  useConfirmActionMessage,
} from '@/components/dialogs/MessageDialog.client';
import {
  Typography,
  Box,
  Button,
  IconButton,
  SxProps,
  Theme,
  Avatar,
  Snackbar,
} from '@mui/material';
import CancellableTextField from '@/components/TextFields/CancellableTextField';
import { LoadingButton } from '@mui/lab';
import BottomSelectionButton from '@/components/buttons/BottomSelectionButton.client';
import Sheet from 'react-modal-sheet';

// hooks
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { useCenterFixedPosition } from '@/utils/usePosition';
import { isMobile } from 'react-device-detect';

// models
import {
  SectionsBottomModalSheet,
  SelectionOption,
} from '@/components/SelectionSheet/BottomModalSelectionSheet.client';
import colors from '@/styles/colors.config';
import { ChevronRightIcon, LinkIcon, PlusIcon, XIcon } from 'lucide-react';
import { ProfileLinkInput } from '@/redux/features/flows/onBoardingSlice';
import LinearProgressIndicator from '@/components/LinearProgressIndicator';

const Step4Page: React.FC<{
  state: ReturnType<typeof _useOnboardingPageState>;
}> = ({ state }) => {
  const { left } = useCenterFixedPosition();
  const [errorMessage, setErrorMessage] = React.useState('');
  const validateStep = () => {
    if (!state.state.bio) {
      setErrorMessage('Bio is required');
      return false;
    }
    if (!state.state.name) {
      setErrorMessage('Name is required');
      return false;
    }
    if (!state.state.userHandle) {
      setErrorMessage('User handle is required');
      return false;
    }

    if (!state.state.ei) {
      setErrorMessage('EI is required');
      return false;
    }
    if (!state.state.sn) {
      setErrorMessage('SN is required');
      return false;
    }
    if (!state.state.tf) {
      setErrorMessage('TF is required');
      return false;
    }
    if (!state.state.jp) {
      setErrorMessage('JP is required');
      return false;
    }
    if (!state.state.pronouns) {
      setErrorMessage('Pronouns are required');
      return false;
    }

    return true;
  };
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = React.useState(false);
  const [editLinkInfo, setEditLinkInfo] = React.useState<{
    isOpen: boolean;
    index?: number;
    link?: ProfileLinkInput;
  }>({
    isOpen: false,
  });

  return (
    <>
      <Scaffold
        appbar={
          <AppBar
            title={'Share your favorite links'}
            backButton={
              <BackIconButton
                onClick={() => {
                  state.actions.goBack();
                }}
              />
            }
            progressIndicator={
              <>
                <LinearProgressIndicator progress={Math.floor((4 / 5) * 100)} />
              </>
            }
          />
        }
        mainBody={
          <MainBody
            sx={{
              paddingX: '16px',
              justifyContent: 'center',
            }}
          >
            {state.state.links.map((link, index) => {
              return (
                <Box key={index} width={'100%'}>
                  <LinkDisplayCard
                    link={link}
                    onClick={() => {
                      setEditLinkInfo({
                        isOpen: true,
                        index,
                        link,
                      });
                      console.log(editLinkInfo);
                    }}
                  />
                  <Box paddingBottom="16px" aria-label="spacer" />
                </Box>
              );
            })}

            {state.state.links.length < 5 && (
              <LoadingButton
                startIcon={<PlusIcon size={18} />}
                variant="contained"
                sx={{
                  paddingX: '24px',
                  backgroundColor: colors.secondarySwatch.main[90],
                  color: colors.secondarySwatch.main[10],
                  '&:hover': {
                    backgroundColor: colors.secondarySwatch.main[80],
                    color: colors.secondarySwatch.main[10],
                  },
                }}
                onClick={() => setIsAddLinkModalOpen(true)}
              >
                <Typography
                  variant="labelLarge"
                  sx={{
                    transform: 'translateY(2px)',
                  }}
                >
                  Add Link
                </Typography>
              </LoadingButton>
            )}

            {state.state.links.length >= 5 && (
              <Typography
                variant="labelLarge"
                color={colors.neutralSwatch.main[40]}
                sx={{
                  textAlign: 'center',
                  paddingTop: '16px',
                }}
              >
                5 links maximum
              </Typography>
            )}
          </MainBody>
        }
      />

      {/* Floating Button */}
      <Box // bot mid floating button
        sx={{
          position: 'fixed',
          bottom: '16px',
          left: `${left}px`,
          transform: isMobile ? 'translateX(-50%)' : 'translateX(-52%)',
        }}
      >
        <LoadingButton
          variant="contained"
          onClick={() => {
            setErrorMessage('');
            if (validateStep()) {
              state.actions.submitAndCreateProfile();
            }
          }}
          sx={{
            // paddingX: '20px',
            width: '217px',
          }}
          disabled={
            !Boolean(
              state.state.bio &&
                state.state.name &&
                state.state.ei &&
                state.state.sn &&
                state.state.tf &&
                state.state.jp &&
                state.state.pronouns &&
                state.state.userHandle,
            )
          }
          loading={state.state.isSubmitting}
        >
          <Typography variant="labelLarge">Make Public Profile</Typography>
        </LoadingButton>
      </Box>

      {/* add link dialog */}
      <EditLinksModal
        // key={editLinkInfo.index} // @dev - this would break the animation
        isOpen={
          editLinkInfo.isOpen &&
          editLinkInfo.link !== undefined &&
          editLinkInfo.index !== undefined
        }
        onClose={() => setEditLinkInfo({ isOpen: false })}
        link={editLinkInfo.link}
        onRemoveLink={() => {
          state.actions.removeLinkByIndex(editLinkInfo.index!);
          setEditLinkInfo({ isOpen: false });
        }}
        onEditLink={(link: ProfileLinkInput) => {
          state.actions.setLinkByIndex({
            title: link.title,
            url: link.url,
            index: editLinkInfo.index!,
          });
          setEditLinkInfo({ isOpen: false });
        }}
      />
      <AddLinksModal
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
        onAddLink={(link: ProfileLinkInput) => {
          state.actions.addLink(link);
          setIsAddLinkModalOpen(false);
        }}
      />
      <Snackbar // submission error
        open={Boolean(state.state.createProfileError)}
        message={state.state.createProfileError}
        autoHideDuration={6000}
        onClose={() => state.actions.setCreateProfileError(null)}
      />
    </>
  );
};

export default Step4Page;

/**
 * Other Components
 */
export const AddLinksModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  onAddLink: (link: ProfileLinkInput) => void;
}> = ({ isOpen, onClose, onAddLink, isLoading }) => {
  const [linkTitle, setLinkTitle] = React.useState('');
  const [linkUrl, setLinkUrl] = React.useState('');

  const [titleError, setTitleError] = React.useState('');
  const [urlError, setUrlError] = React.useState('');

  const validate = () => {
    setTitleError('');
    setUrlError('');
    let valid = true;
    if (!linkTitle) {
      setTitleError('Title is required');
      valid = false;
    }
    if (!linkUrl) {
      setUrlError('URL is required');
      valid = false;
    }
    /**
     * check if url is valid, using regex
     */
    // const urlRegex = new RegExp(
    //   '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$',
    // );
    // if (!urlRegex.test(linkUrl)) {
    //   setUrlError('Invalid URL');
    //   valid = false;
    // }
    return valid;
  };

  const _clearState = () => {
    setLinkTitle('');
    setLinkUrl('');
    setTitleError('');
    setUrlError('');
  };
  const _onClose = () => {
    _clearState();
    onClose();
  };

  const _onAddLink = () => {
    onAddLink({
      title: linkTitle,
      url: linkUrl,
    });
    _clearState();
  };

  return (
    <>
      <Sheet isOpen={isOpen} onClose={_onClose}>
        <Sheet.Container>
          {/* <Sheet.Header>
                            <Typography variant="h5">Edit Links</Typography>
                        </Sheet.Header> */}
          <AppBar
            title={'Add Link'}
            backButton={
              <IconButton onClick={_onClose} disabled={isLoading}>
                <XIcon />
              </IconButton>
            }
            sx={{
              backgroundColor: colors.primarySwatch.main[98],
            }}
            rightMostIcon={
              <LoadingButton
                onClick={() => {
                  if (validate()) {
                    _onAddLink();
                  }
                }}
                loading={isLoading}
                disabled={isLoading}
              >
                <Typography>Save</Typography>
              </LoadingButton>
            }
          />

          <Sheet.Content>
            <Box
              sx={{
                paddingX: '16px',
                paddingY: '16px',
              }}
            >
              <CancellableTextField
                required={false}
                label="Title"
                content={linkTitle}
                setContent={setLinkTitle}
                sx={{
                  '& .MuiInputBase-root.MuiFilledInput-root': {
                    backgroundColor: `${colors.primarySwatch.main[95]} !important`,
                  },
                  '& .MuiFormLabel-root.MuiInputLabel-root': {
                    color: `${colors.neutralSwatch.main[50]}`,
                    '&.Mui-focused': {
                      color: `${colors.primarySwatch.main[40]}`,
                    },
                  },
                }}
                errorMessage={titleError}
                hasError={Boolean(titleError)}
                disabled={isLoading}
                maxLength="20"
                // InputProps={{}}
                helperText={''}
              />
              <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
              <CancellableTextField
                required={false}
                label="URL"
                content={linkUrl}
                setContent={setLinkUrl}
                sx={{
                  '& .MuiInputBase-root.MuiFilledInput-root': {
                    backgroundColor: `${colors.primarySwatch.main[95]} !important`,
                  },
                  '& .MuiFormLabel-root.MuiInputLabel-root': {
                    color: `${colors.neutralSwatch.main[50]}`,
                    '&.Mui-focused': {
                      color: `${colors.primarySwatch.main[40]}`,
                    },
                  },
                }}
                errorMessage={urlError}
                hasError={Boolean(urlError)}
                disabled={isLoading}
              />
            </Box>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
};

export const EditLinksModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
  link?: ProfileLinkInput;
  onRemoveLink: () => void;
  onEditLink: (link: ProfileLinkInput) => void;
}> = ({ isOpen, onClose, link, onRemoveLink, onEditLink, isLoading }) => {
  const [linkTitle, setLinkTitle] = React.useState(link?.title || '');
  const [linkUrl, setLinkUrl] = React.useState(link?.url || '');
  const [titleError, setTitleError] = React.useState('');
  const [urlError, setUrlError] = React.useState('');

  const validate = () => {
    setTitleError('');
    setUrlError('');
    let valid = true;
    if (!linkTitle) {
      setTitleError('Title is required');
      valid = false;
    }
    if (!linkUrl) {
      setUrlError('URL is required');
      valid = false;
    }
    /**
     * check if url is valid, using regex
     */
    // const urlRegex = new RegExp(
    //   '^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?$',
    // );
    // if (!urlRegex.test(linkUrl)) {
    //   setUrlError('Invalid URL');
    //   valid = false;
    // }

    return valid;
  };

  useEffect(() => {
    setLinkTitle(link?.title || '');
    setLinkUrl(link?.url || '');
  }, [link]);

  const _clearState = () => {
    setLinkTitle('');
    setLinkUrl('');
    setTitleError('');
    setUrlError('');
  };
  const _onClose = () => {
    _clearState();
    onClose();
  };

  const _onEditLink = () => {
    onEditLink({
      title: linkTitle,
      url: linkUrl,
    });
    _clearState();
  };
  const _removeLink = () => {
    onRemoveLink();
    _clearState();
  };
  return (
    <>
      <Sheet isOpen={isOpen} onClose={_onClose}>
        <Sheet.Container>
          <AppBar
            title={'Edit Link'}
            backButton={
              <IconButton onClick={_onClose} disabled={isLoading}>
                <XIcon />
              </IconButton>
            }
            sx={{
              backgroundColor: colors.primarySwatch.main[98],
            }}
            rightMostIcon={
              <Button
                onClick={() => {
                  if (validate()) {
                    _onEditLink();
                  }
                }}
                disabled={isLoading}
              >
                <Typography>Save</Typography>
              </Button>
            }
          />

          <Sheet.Content>
            <Box
              sx={{
                paddingX: '16px',
                paddingY: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <CancellableTextField
                label="Title"
                content={linkTitle}
                setContent={setLinkTitle}
                sx={{
                  '& .MuiInputBase-root.MuiFilledInput-root': {
                    backgroundColor: `${colors.primarySwatch.main[95]} !important`,
                  },
                }}
                errorMessage={titleError}
                hasError={Boolean(titleError)}
                disabled={isLoading}
              />
              <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />
              <CancellableTextField
                label="URL"
                content={linkUrl}
                setContent={setLinkUrl}
                sx={{
                  '& .MuiInputBase-root.MuiFilledInput-root': {
                    backgroundColor: `${colors.primarySwatch.main[95]} !important`,
                  },
                }}
                errorMessage={urlError}
                hasError={Boolean(urlError)}
                disabled={isLoading}
              />
              <Box sx={{ paddingTop: '16px' }} aria-label="spacer" />

              <Button
                onClick={() => {
                  _removeLink();
                }}
                disabled={isLoading}
              >
                <Typography variant="labelLarge" color={colors.accentError}>
                  Remove Link
                </Typography>
              </Button>
            </Box>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
};

export const LinkDisplayCard: React.FC<{
  link: ProfileLinkInput;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}> = ({ link, sx, onClick }) => {
  return (
    <Button
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        gap: '8px',
        height: '56px',
        padding: '8px 12px',
        borderRadius: '8px',
        backgroundColor: colors.primarySwatch.main[98],
        border: `1px solid ${colors.primarySwatch.main[90]}`,
        ...sx,
      }}
      onClick={onClick}
    >
      <Avatar
        sx={{
          width: '28px',
          height: '28px',
          backgroundColor: colors.secondarySwatch.main[90],
        }}
      >
        <LinkIcon color={colors.secondarySwatch.main[10]} size={16} />
      </Avatar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          width: '100%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        <Typography
          variant="labelLarge"
          color={colors.primarySwatch.main[10]}
          sx={{
            textAlign: 'left',
            fontFamily: 'Neue Metana',
            transform: 'translateY(2px)',
          }}
        >
          {link.title}
        </Typography>
        <Typography
          variant="labelSmall"
          color={colors.neutralSwatch.main[50]}
          sx={{
            textAlign: 'left',
            // transform: 'translateY(2px)',
          }}
        >
          {link.url}
        </Typography>
      </Box>
      <ChevronRightIcon color={colors.neutralSwatch.main[30]} />
    </Button>
  );
};
