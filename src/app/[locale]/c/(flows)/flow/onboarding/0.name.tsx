'use client';
import React from 'react';
import { _useOnboardingPageState } from './OnboardingFlowPage';

// Skeleton
import Scaffold from '@/components/scaffolds/Scaffold';
import AppBar from '@/components/appbars/AppBar';
import BackIconButton from '@/components/buttons/BackIconButton.client';
import MainBody from '@/components/MainBody';
import MessageDialog, {
  useConfirmActionMessage,
} from '@/components/dialogs/MessageDialog.client';
import { Typography, Box, InputAdornment, IconButton } from '@mui/material';
import CancellableTextField from '@/components/TextFields/CancellableTextField';
import { LoadingButton } from '@mui/lab';

// hooks
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { useCenterFixedPosition } from '@/utils/usePosition';
import { useMutationCheckUserHandle } from '@/data/graphql/hooks/useMutationCheckUserHandle';

// models
import assets from '@/constants';
import colors from '@/styles/colors.config';
import { isMobile } from 'react-device-detect';
import LinearProgressIndicator from '@/components/LinearProgressIndicator';
import { CheckIcon, RefreshCwIcon } from 'lucide-react';

const Step0Page: React.FC<{
  state: ReturnType<typeof _useOnboardingPageState>;
}> = ({ state }) => {
  const {
    state: { isOpen, message },
    actions: { setIsConfirmed, confirmAction },
  } = useConfirmActionMessage();
  const { left } = useCenterFixedPosition();
  const {
    utils: { dgSignOut },
  } = useDGAuth();

  const [nameEM, setNameEM] = React.useState('');
  const [handleEM, setHandleEM] = React.useState('');
  const [isUserHandleOkay, setIsUserHandleOkay] = React.useState(false);
  const {
    state: { checkUserHandleState },
    actions: { checkUserHandle },
  } = useMutationCheckUserHandle();

  const _clearState = () => {
    setNameEM('');
    setHandleEM('');
    setIsUserHandleOkay(false);
  };

  const validateStep = () => {
    if (!state.state.name) {
      setNameEM('Name is required');
      return false;
    } else if (!state.state.userHandle) {
      setHandleEM('User handle is required');
      return false;
    }

    return true;
  };

  return (
    <>
      <Scaffold
        appbar={
          <AppBar
            title={<Box paddingY={'8px'}>What shall we call you?</Box>}
            backButton={
              <BackIconButton
                onClick={() => {
                  /**
                   * logout
                   */
                  confirmAction('Are you sure to logout?', dgSignOut);
                }}
              />
            }
            progressIndicator={
              <>
                <LinearProgressIndicator progress={0} />
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
            <CancellableTextField
              hiddenLabel
              // label="Display name"
              content={state.state.name}
              placeholder="Alex"
              setContent={(s) => {
                (isUserHandleOkay || nameEM || handleEM) && _clearState();
                state.actions.setName(s);
                const newUsername = s
                  .replace(/[^a-zA-Z0-9]/g, '_')
                  .toLowerCase();
                state.actions.setUserHandle(newUsername);
              }}
              maxLength="20"
              errorMessage={nameEM}
              hasError={Boolean(nameEM)}
              sx={{
                '& .MuiInputBase-root.MuiFilledInput-root': {
                  backgroundColor: `${colors.primarySwatch.main[95]} !important`,
                },
                '& .MuiInputBase-input.MuiFilledInput-input': {
                  paddingLeft: '16px',
                },
              }}
              helperText={
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'Basier Circle',
                  }}
                  variant="bodySmall"
                  color={colors.neutralSwatch.main[50]}
                >
                  Your display name
                  {/* {state.state.bio.length > 21 && (
                    <Typography color={colors.accentError} variant="bodySmall">
                      TLDR
                    </Typography>
                  )} */}
                </Typography>
              }
            />
            <Box paddingTop={'32px'} aria-label="spacer" />
            <CancellableTextField
              hiddenLabel
              // label="User name"
              content={state.state.userHandle}
              placeholder="alex_travel"
              setContent={(s) => {
                (isUserHandleOkay || nameEM || handleEM) && _clearState();

                s = s.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                state.actions.setUserHandle(s);
              }}
              maxLength="20"
              errorMessage={handleEM}
              hasError={Boolean(handleEM)}
              sx={{
                '& .MuiInputBase-root.MuiFilledInput-root': {
                  backgroundColor: `${colors.primarySwatch.main[95]} !important`,
                },
                '& .MuiInputBase-input.MuiFilledInput-input': {
                  paddingLeft: '16px',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position={'end'}>
                    <LoadingButton
                      onClick={() => {
                        checkUserHandle({
                          handle: state.state.userHandle,
                        }).then((res) => {
                          if (
                            res.data?.checkUserHandleValidity?.status === 'ok'
                          ) {
                            setIsUserHandleOkay(true);
                          } else {
                            setHandleEM(
                              res.data?.checkUserHandleValidity.message || '',
                            );
                            setIsUserHandleOkay(false);
                          }
                        });
                      }}
                      sx={{
                        padding: '10px',
                        // width: "65px",
                        margin: 0,
                        minWidth: 42,
                        color: colors.neutralSwatch.main[40],
                        '&:hover': {
                          color: colors.neutralSwatch.main[50],
                          backgroundColor: colors.primarySwatch.main[95],
                        },
                      }}
                      loading={checkUserHandleState.fetching}
                      disabled={
                        checkUserHandleState.fetching || isUserHandleOkay
                      }
                    >
                      {/* <CheckIcon color={colors.accentSuccess} size={20} />/ */}

                      {!checkUserHandleState.fetching && !isUserHandleOkay && (
                        <Typography color={colors.primarySwatch.main[40]}>
                          Verify
                        </Typography>
                      )}
                      {isUserHandleOkay && (
                        <CheckIcon color={colors.accentSuccess} size={20} />
                      )}
                    </LoadingButton>
                  </InputAdornment>
                ),
              }}
              helperText={
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: 'Basier Circle',
                  }}
                  variant="bodySmall"
                  color={colors.neutralSwatch.main[50]}
                >
                  {handleEM || 'Your username must be unique'}
                  {/* {state.state.bio.length > 21 && (
                    <Typography color={colors.accentError} variant="bodySmall">
                      TLDR
                    </Typography>
                  )} */}
                </Typography>
              }
            />
          </MainBody>
        }
      />
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
            (isUserHandleOkay || nameEM || handleEM) && _clearState();
            if (validateStep()) {
              state.actions.goNext();
            }
          }}
          sx={{
            paddingX: '24px',
          }}
          disabled={!Boolean(state.state.name) || !isUserHandleOkay}
        >
          <Typography variant="labelLarge">Next</Typography>
        </LoadingButton>
      </Box>
      <MessageDialog
        open={isOpen}
        onIsConfirm={setIsConfirmed}
        content={message}
      />
    </>
  );
};

export default Step0Page;
