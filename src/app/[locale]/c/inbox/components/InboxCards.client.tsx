'use client';
import { Box, Card, CardContent, CardMedia, Chip } from '@mui/material';
import { capitalize } from '@mui/material/utils';
import {
  CommunityInboxMessage,
  markReadMessage,
} from '@/data/repositaries/CommunityInboxRepo';
import Image from 'next/image';
import colors from '@/styles/colors.config';
import { useAppRouting } from '@/app/providers/AppRoutingContextProvider';
import { markAsRead } from '@/redux/features/community/communityInboxsSlice';
import routes from '@/routes/routes';
import { QuestChip } from '@/components/QuestChip';
import { Dot, Circle } from 'lucide-react';
import { useDGAuth } from '@dttd-io/dg-auth-lib';
import { inboxOnClick } from './inboxOnClick.client';
import { useLogEvent } from '@/app/providers/LogEventContextProvider';
import { useAppDispatch } from '@/redux/hook';
// constants
import assets, { ButtonID } from '@/constants';
import { useState } from 'react';

type InboxCardProps = {
  inbox: CommunityInboxMessage;
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

const InboxCard: React.FC<InboxCardProps> = ({ inbox }) => {
  const dispatch = useAppDispatch();
  const { navigate, constructPath } = useAppRouting();
  const {
    utils: { getBearerToken },
  } = useDGAuth();
  const [isRead, setIsRead] = useState<boolean>(inbox.is_read);
  const { logButtonClick } = useLogEvent();

  return (
    <Card
      onClick={async () => {
        logButtonClick(ButtonID.inbox.card, `${inbox.msg_id}`);
        isRead === false &&
          markReadMessage({
            accessToken: (await getBearerToken()).jwtToken,
            msgId: inbox.msg_id,
            communityId: inbox.community_id,
          });
        setIsRead(true);
        dispatch(markAsRead(inbox.msg_id));
        inboxOnClick(inbox, navigate);
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
        src={inbox.msg_img_url || assets.images.notification.defaultIcon}
        alt="Avatar"
        width={68}
        height={68}
        style={{
          borderRadius: '8px',
          width: 68,
          height: 68,
          objectFit: 'cover',
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
          <QuestChip text={inbox.msg_type} />
          <div className="tw-pr-[4px]" aria-hidden="true"></div>
          <div className="label-medium tw-text-neutralSwatch-80 tw-whitespace-nowrap">
            {inbox.created_at ? formatDate(inbox.created_at) : ''}
          </div>
          <div className="tw-w-full" aria-hidden="true"></div>
          {isRead === false && (
            <Circle color={colors.primary} fill={colors.primary} size={10} />
          )}
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
          {inbox.msg_title}
          {/* Invite your friends to complete the MBTI test and... */}
        </div>
      </Box>
    </Card>
  );
};

export { InboxCard };
