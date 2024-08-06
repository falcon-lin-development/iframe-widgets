import { useMemo } from 'react';
import colors from '@/styles/colors.config';
import { Box, Divider, SxProps, Theme, Typography } from '@mui/material';
import {
  BarChart3,
  Eye,
  Heart,
  LucideMessageCircleQuestion,
  MessageSquare,
} from 'lucide-react';
import { WyrPost } from '../../graphql/models/WyrPost';
import MaxLineTypography from '@/components/MaxLineTypography';
import Link from 'next/link';
import { formatCounts } from '@/utils/formatCounts';
import { formatTime } from '@/utils/formatTime';

export const WyrSummaryCard: React.FC<{
  wyrPost: WyrPost;
  href?: string;
  sx?: SxProps<Theme>;
}> = ({ wyrPost, sx, href }) => {
  if (!wyrPost) return null;

  return (
    <>
      <Link href={href || '#'}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '12px',
            backgroundColor: colors.primarySwatch.lavender[98],
            border: '1px solid',
            borderRadius: '8px',
            borderColor: colors.primarySwatch.lavender[90],
            ...sx,
          }}
        >
          <TitleRow wyrPost={wyrPost} />
          <Box sx={{ paddingTop: '12px' }}></Box>
          <ContentRow wyrPost={wyrPost} />

          <Divider
            sx={{
              margin: '12px 0',
              backgroundColor: colors.primarySwatch.main[80],
            }}
          />
          <StatRow wyrPost={wyrPost} />
        </Box>
      </Link>
    </>
  );
};

const TitleRow: React.FC<{
  wyrPost: WyrPost;
  sx?: SxProps<Theme>;
}> = ({ wyrPost, sx }) => {
  const wyrDate = new Date(wyrPost.createdAt).toLocaleDateString();
  const wyrDateRepr = useMemo(() => {
    return formatTime(wyrPost.createdAt);
  }, [wyrDate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          // icon + title
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          maxWidth: 'calc(100% - 50px)',
        }}
      >
        <LucideMessageCircleQuestion
          size={18}
          style={{
            minWidth: '18px',
            color: colors.primarySwatch.lavender.primary,
          }}
        />
        <Box sx={{ paddingRight: '8px' }} aria-label="spacer" />
        <MaxLineTypography
          variant="titleSmall"
          sx={{
            maxWidth: 'calc(100%)',
            '& .MuiTypography-root': {
              transform: 'translateY(2px)',
              textAlign: 'left',
              WebkitLineClamp: '1 !important',
            },
          }}
        >
          {wyrPost.postContent.caption || 'Would you rather...'}
        </MaxLineTypography>
      </Box>
      {/* end */}
      <Typography
        variant="labelMedium"
        sx={{
          color: colors.neutralSwatch.main[80],
          minWidth: '140px',
          transform: 'translateY(2px)',
          textAlign: 'right',
        }}
      >
        {wyrDateRepr}
      </Typography>
    </Box>
  );
};

const ContentRow: React.FC<{
  wyrPost: WyrPost;
  sx?: SxProps<Theme>;
}> = ({ wyrPost, sx }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '50%',
        }}
      >
        <MaxLineTypography
          variant="bodyMedium"
          sx={{
            color: colors.primarySwatch.main[40],
            minHeight: '48px',
            maxWidth: '100%',
            paddingRight: '20px',
            '& .MuiTypography-root': {
              fontFamily: 'Neue Metana',
              WebkitLineClamp: '3 !important',
              fontWeight: 700,
            },
          }}
        >
          {wyrPost.postContent.options[0].option_text}
        </MaxLineTypography>
      </Box>
      <Typography
        variant="labelMedium"
        sx={{
          color: colors.neutralSwatch.main[80],
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%)',
        }}
      >
        or
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '50%',
          overflow: 'hidden',
        }}
      >
        <MaxLineTypography
          variant="bodyMedium"
          sx={{
            color: colors.primarySwatch.main[40],
            minHeight: '48px',
            maxWidth: '100%',
            paddingLeft: '20px',
            '& .MuiTypography-root': {
              fontFamily: 'Neue Metana',
              WebkitLineClamp: '3 !important',
              fontWeight: 700,
            },
          }}
        >
          {wyrPost.postContent.options[1].option_text}
        </MaxLineTypography>
      </Box>
    </Box>
  );
};

const StatRow: React.FC<{
  wyrPost: WyrPost;
  sx?: SxProps<Theme>;
}> = ({ wyrPost, sx }) => {
  const _Stat: React.FC<{
    icon: React.ReactNode;
    countRepr: string;
  }> = ({ icon, countRepr }) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Box sx={{ paddingLeft: '4px' }} aria-label="spacer" />
        <Typography
          variant="bodyMedium"
          sx={{
            color: colors.neutralSwatch.main[50],
            width: '30px',
            textAlign: 'left',
          }}
        >
          {countRepr}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-start',
      }}
    >
      <svg width="0" height="0">
        <defs>
          <linearGradient
            id="heartGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(208, 149, 236, 1)" />
            <stop offset="100%" stopColor="rgba(234, 89, 165, 1)" />
          </linearGradient>
          <linearGradient
            id="messageGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(208, 149, 236, 1)" />
            <stop offset="100%" stopColor="rgba(135, 228, 249, 1)" />
          </linearGradient>
        </defs>
      </svg>
      <_Stat
        icon={
          <Heart
            size={18}
            style={{
              display: 'inline-block',
            }}
            color="url(#heartGradient)"
            fill="url(#heartGradient)"
          />
        }
        countRepr={formatCounts(wyrPost.viewStats.like_count)}
      />
      <Box sx={{ paddingLeft: '16px' }} aria-label="spacer" />
      <_Stat
        icon={
          <MessageSquare
            size={18}
            style={{
              display: 'inline-block',
            }}
            color="url(#messageGradient)"
            fill="url(#messageGradient)"
          />
        }
        countRepr={formatCounts(wyrPost.viewStats.comment_count)}
      />

      <Box sx={{ paddingLeft: '16px' }} aria-label="spacer" />

      <_Stat
        icon={
          <BarChart3
            size={18}
            style={{
              display: 'inline-block',
            }}
            color={colors.neutralSwatch.main[50]}
          />
        }
        countRepr={formatCounts(
          wyrPost.userDetails.response_stats?.total_count,
        )}
      />

      <Box sx={{ paddingLeft: '16px' }} aria-label="spacer" />

      <_Stat
        icon={
          <Eye
            size={18}
            style={{
              display: 'inline-block',
            }}
            color={colors.neutralSwatch.main[50]}
          />
        }
        countRepr={formatCounts(wyrPost.viewStats.view_count)}
      />
    </Box>
  );
};
