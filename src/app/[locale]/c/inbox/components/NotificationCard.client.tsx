'use client';
import { Box, Card, CardContent, CardMedia, Chip } from '@mui/material';
import { capitalize } from '@mui/material/utils';
import Image from 'next/image';
import colors from '@/styles/colors.config';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { QuestChip } from '@/components/QuestChip';
import routes from '@/routes/routes';
import { Dot, Circle } from 'lucide-react';
import { useDGAuth } from '@dttd-io/dg-auth-lib';

// constants
import assets, { ButtonID } from '@/constants';
import { useMemo, useState } from 'react';
import {
  BackendNotification,
  BackendNotificationCategory,
} from '../../graphql/models/BackendNotification';

// hoooks
import { useReadNotification } from '../../graphql/hooks/useReadNotification';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useAppDispatch } from '@/redux/hook';
import { Community } from '@/data/services/fetchCommunityService';
import { InboxPageStateHook } from './InboxScaffold.client';
import Link from 'next/link';
import { DEFAULT_BADGE_BG } from '@/styles/bgOptions/BadgeBGOptions';

const notificationDisplayImages: Record<BackendNotificationCategory, string> = {
  wyr_notification: assets.images.notification.defaultWyrIcon,
};

const notificationChip2Repr = {
  wyr_notification: 'would you rather',
  badge: 'attribute',
  user_profile: 'profile',
};

function formatDate(dateNumber: number | string): string {
  try {
    const date = new Date(dateNumber);
    const now: Date = new Date();
    const givenDate: Date = new Date(date);
    const oneDay: number = 24 * 60 * 60 * 1000; // milliseconds in one day

    // Calculate the difference in days between the given date and the current date
    const diffDays: number = Math.round(
      Math.abs((now.getTime() - givenDate.getTime()) / oneDay),
    );

    let formattedDate: string;

    // If the difference is more than one day, format as 'YYYY-MM-DD HH:mm'
    if (diffDays > 1) {
      formattedDate = givenDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour time; set to true for AM/PM formatting
      });
    } else {
      // Else, just show 'HH:mm'
      formattedDate = givenDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour time; set to true for AM/PM formatting
      });
    }

    return formattedDate;
  } catch (e) {
    console.log(e);
    return '';
  }
}

const _useNotificationCardState = (
  notification: BackendNotification,
  community: Community,
  pageState: InboxPageStateHook,
) => {
  // current UI
  const [_isRead, _setIsRead] = useState<boolean>(notification.isRead);
  // frontend State
  const {
    state: { readedState },
    actions: { markAsRead: frontendMarkAsRead },
  } = pageState;
  // backend State
  const {
    state: { readResult },
    actions: { readNotification },
  } = useReadNotification({ notification, community });

  const markAsRead = async () => {
    // set state read
    _setIsRead(true);

    // set frontend state read
    frontendMarkAsRead(notification.notificationId);

    // call mutation
    readNotification();
  };

  const isRead = useMemo(() => {
    // if readResult.data, then use read result.data
    const hasRead = [
      _isRead,
      readedState[notification.notificationId],
      notification.isRead, // this one should be included by _isRead
      readResult.data?.readNotification.reference.notification_id,
    ].some((x) => x === true);
    return hasRead;
  }, [_isRead, readedState, notification.isRead, readResult.data]);

  return {
    state: {
      isRead,
    },
    actions: {
      markAsRead,
    },
  };
};

const NotificationCard: React.FC<{
  pageState: InboxPageStateHook;
  notification: BackendNotification;
  community: Community;
}> = ({ notification, community, pageState }) => {
  const dispatch = useAppDispatch();
  const { navigate, constructPath } = useAppRouting();
  const {
    utils: { getBearerToken },
  } = useDGAuth();
  const { logButtonClick } = useLogEvent();
  const {
    state: { isRead },
    actions: { markAsRead },
  } = _useNotificationCardState(notification, community, pageState);

  return (
    <Link href={notification.content.link || '#'} target="_blank">
      <Card
        onClick={async () => {
          logButtonClick(ButtonID.inbox.card, `${notification.notificationId}`);
          markAsRead();
        }}
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: '12px',
          borderRadius: '8px',
          borderColor:
            isRead === false ? colors.primary : colors.primarySwatch.main[95],
          backgroundColor: colors.primarySwatch.main[98],
          '&:hover': {
            cursor: 'pointer',
          },
        }}
      >
        <Image
          src={
            notification.content.image_url ||
            notificationDisplayImages[notification.category] ||
            assets.images.notification.defaultIcon
          }
          alt="Avatar"
          width={68}
          height={68}
          style={{
            borderRadius: '16px',
            width: 68,
            height: 68,
            objectFit: 'cover',
            background: DEFAULT_BADGE_BG,
          }}
        />
        <div className="tw-px-[6px]" aria-hidden="true"></div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <QuestChip
              text={
                notification.category in notificationChip2Repr
                  ? notificationChip2Repr[notification.category]
                  : notification.category
              }
            />
            <div className="tw-pr-[4px]" aria-hidden="true"></div>
            <div className="label-medium tw-text-neutralSwatch-80 tw-whitespace-nowrap">
              {notification.updatedAt ? formatDate(notification.updatedAt) : ''}
            </div>
            <div className="tw-w-full" aria-hidden="true"></div>
            <Box
              sx={{
                width: '10px',
              }}
            >
              {isRead === false && (
                <Circle color={colors.primary} fill={colors.primary} size={6} />
              )}
            </Box>
          </Box>
          <div className="tw-pt-[4px]" aria-hidden="true"></div>
          <div
            className="body-medium tw-text-primarySwatch-10"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {notification.content.text}
            {/* Invite your friends to complete the MBTI test and... */}
          </div>
        </Box>
      </Card>
    </Link>
  );
};

export { NotificationCard };
