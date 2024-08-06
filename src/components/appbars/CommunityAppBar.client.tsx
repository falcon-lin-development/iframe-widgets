'use client';
import React, { useState, useEffect } from 'react';
import AppBar from '@/components/appbars/AppBar';
import AppIcon from '@/components/AppIcon';
import {
  Box,
  CircularProgress,
  IconButton,
  Button,
  Avatar,
  Badge,
} from '@mui/material';
import { Pencil, LogOut, Bell, Settings, FlaskConicalIcon } from 'lucide-react';
import { Community } from '@/data/services/fetchCommunityService';
import { CommunityProfile } from '@/data/repositaries/CommunityProfileRepo';
import MessageDialog from '@/components/dialogs/MessageDialog.client';
import SettingDialog from '@/components/dialogs/SettingsDialog.client';
import colors from '@/styles/colors.config';

import routes from '@/routes/routes';

// constants
import { CommunityInboxMessagesList } from '@/data/repositaries/CommunityInboxRepo';
import assets from '@/constants';
import { resetAllState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hook';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import Link from 'next/link';
import { ButtonID } from '@/constants';

// hooks
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { useCommunityNotifications } from '../../app/[locale]/c/providers/CommunityNotificationContextProvider';
import { useReadNotification } from '../../app/[locale]/c/graphql/hooks/useReadNotification';

type Props = {
  community: Community;
  communityProfile?: CommunityProfile;
  communityInboxs?: CommunityInboxMessagesList;
};

const _useAppBarStates = (community: Community) => {
  const {
    utils: { dgSignOut },
  } = useDGAuth();
  const {
    state: { personaProfileSubscriptionState },
  } = useCommunityNotifications();
  const {
    actions: { readNotification },
  } = useReadNotification({ community });
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = React.useState(false);
  const [isConfirmedLogout, setIsConfirmedLogout] = useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = React.useState(false);

  const dispatch = useAppDispatch();
  const { navigate } = useAppRouting();
  const { logButtonClick } = useLogEvent();

  // catch confirm logout
  useEffect(() => {
    if (isConfirmedLogout === true) {
      dgSignOut();
      dispatch(resetAllState());
    }
  }, [isConfirmedLogout]);

  return {
    state: {
      isSignOutDialogOpen,
      isSettingOpen,
      personaProfileSubscriptionState,
    },
    actions: {
      setIsSignOutDialogOpen,
      setIsSettingOpen,
      setIsConfirmedLogout,
      logButtonClick,
      navigate,
      readNotification,
    },
  };
};

const CommunityAppBar: React.FC<Props> = ({
  community,
  // communityProfile,
  // communityInboxs,
}) => {
  const {
    state: {
      isSignOutDialogOpen,
      isSettingOpen,
      personaProfileSubscriptionState,
    },
    actions: {
      setIsSignOutDialogOpen,
      setIsSettingOpen,
      setIsConfirmedLogout,
      logButtonClick,
      navigate,
      readNotification,
    },
  } = _useAppBarStates(community);

  return (
    <>
      <AppBar
        mainIcon={
          community.logo_url ? (
            <AppIcon iconImageUrl={community.logo_url} />
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <CircularProgress
                sx={{
                  padding: '10px',
                  margin: '0px',
                }}
              />
            </Box>
          )
        }
        rightMostIcon={
          <>
            <Link id={ButtonID.appbar.inbox} href={routes.c.inbox._home}>
              <IconButton
                id={ButtonID.appbar.inbox}
                aria-label="Inbox"
                onClick={() => {
                  logButtonClick(ButtonID.appbar.inbox, '');
                  readNotification();
                }}
              >
                {personaProfileSubscriptionState.data?.personaProfileUpdates
                  .notificationFlag === true ? (
                  <Badge
                    sx={{
                      '& .MuiBadge-dot': {
                        backgroundColor: colors.primarySwatch.main.primary,
                        // color: colors.accentInfo,
                      },
                    }}
                    badgeContent={''}
                    variant="dot"
                  >
                    <Bell size={24} color={colors.neutralSwatch.main[30]} />
                  </Badge>
                ) : (
                  <Bell size={24} color={colors.neutralSwatch.main[30]} />
                )}
              </IconButton>
            </Link>
            <Box paddingRight="14px" aria-label="spacer" />
            <IconButton
              id={ButtonID.appbar.setting}
              aria-label="Setting"
              onClick={() => {
                logButtonClick(ButtonID.appbar.setting, '');
                setIsSettingOpen(true);
              }}
            >
              <Settings size={24} color={colors.neutralSwatch.main[30]} />
            </IconButton>

            {process.env.ENV === 'dev' && (
              <>
                <Box paddingRight="14px" aria-label="spacer" />
                <IconButton
                  aria-label="Testing"
                  href={routes.c.profile.profile_page_customization._home}
                >
                  <FlaskConicalIcon
                    size={24}
                    color={colors.neutralSwatch.main[30]}
                  />
                </IconButton>
              </>
            )}
          </>
        }
      />
      <_SettingDialog
        isSettingOpen={isSettingOpen}
        setIsSettingOpen={setIsSettingOpen}
        setIsSignOutDialogOpen={setIsSignOutDialogOpen}
      />
      <MessageDialog
        open={isSignOutDialogOpen}
        onIsConfirm={(isConfirmed: boolean) => {
          setIsSignOutDialogOpen(false);
          setIsConfirmedLogout(isConfirmed);
        }}
        title="Sign out?"
        content="You are going to sign out from the Mootiez Community"
      />
    </>
  );
};

const _SettingDialog: React.FC<{
  isSettingOpen: boolean;
  setIsSettingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignOutDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isSettingOpen, setIsSettingOpen, setIsSignOutDialogOpen }) => {
  const { navigate } = useAppRouting();
  const { logButtonClick } = useLogEvent();
  const _SettingBtn = ({
    icon,
    title,
    onClick,
    id,
  }: {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    id?: string;
  }) => {
    return (
      <Button
        id={id}
        fullWidth
        startIcon={icon}
        onClick={onClick}
        sx={{
          borderRadius: '0',
          padding: '12px 14px',
          justifyContent: 'flex-start',
          '& .MuiTouchRipple-root': {
            borderRadius: '0',
          },
        }}
      >
        <div className="body-large tw-text-neutralSwatch-40">{title}</div>
      </Button>
    );
  };

  return (
    <SettingDialog
      open={isSettingOpen}
      onClose={(isConfirmed: boolean) => {
        setIsSettingOpen(false);
      }}
      contents={
        <>
          {/* <_SettingBtn
            id={ButtonID.setting.edit_username}
            title="Edit Username"
            icon={
              <Pencil
                size={20}
                color={colors.neutralSwatch.main[40]}
                style={{
                  height: '40px',
                  width: '40px',
                  padding: '10px',
                  marginRight: '14px',
                }}
              />
            }
            onClick={() => {
              logButtonClick(ButtonID.setting.edit_username, '');
              navigate(routes.c.profile.edit_username);
            }}
          /> */}

          <_SettingBtn
            id={ButtonID.setting.logout}
            title="Sign out"
            icon={
              <LogOut
                size={20}
                color={colors.neutralSwatch.main[40]}
                style={{
                  height: '40px',
                  width: '40px',
                  padding: '10px',
                  marginRight: '14px',
                }}
              />
            }
            onClick={() => {
              logButtonClick(ButtonID.setting.logout, '');
              setIsSettingOpen(false);
              setIsSignOutDialogOpen(true);
            }}
          />
        </>
      }
    />
  );
};

export default CommunityAppBar;
