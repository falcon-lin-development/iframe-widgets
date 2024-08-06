/**
 * @dev Other Components
 */
'use client';
// components
import {
  Box,
  Stack,
  Button,
  Typography,
  Link,
  Card,
  capitalize,
} from '@mui/material';
import Image from 'next/image';

// models
import { QuestType } from '@/data/services/fetchCommunityQuestsService';
import routes from '@/routes/routes';
import assets, { ButtonID } from '@/constants';
import {
  CollectionTask,
  COLLECT_TASKS,
  DEFAULT_TASK_IMAGE_BG,
} from '@/data/db/collect_tasks';
import { QuestChip } from '@/components/QuestChip';
import colors from '@/styles/colors.config';

export { DEFAULT_TASK_IMAGE_BG };
export const TaskHorizCard: React.FC<{
  task: CollectionTask;
  href: string;
  onClick: () => void;
}> = ({ task, href, onClick }) => {
  const isLive = task.is_live;
  return (
    <Link
      href={href}
      id={`collect-task-card-${task.id}`}
      data-gtm={`collect-task-card-${task.id}`}
      className="collect-task-card"
      sx={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <Card
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: '12px',
          borderRadius: '8px',
          '&:hover': {
            cursor: 'pointer',
          },
          border: isLive
            ? `1px solid ${colors.primarySwatch.main.primary}`
            : `1px solid ${colors.neutralSwatch.main[90]}`,
        }}
        onClick={onClick}
      >
        <Image
          src={task.thumbnail || assets.images.quizzes.defaultIcon}
          alt={`${task.id}`}
          width={84}
          height={84}
          style={{
            borderRadius: '8px',
            width: 84,
            height: 84,
            objectFit: 'contain',
            background: task.css?.background || DEFAULT_TASK_IMAGE_BG,
          }}
        />
        <Box paddingRight="16px" aria-label="spacer" />
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
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <QuestChip text={task.tag} />
            {isLive ? (
              <Typography
                variant="labelMedium"
                sx={{
                  background:
                    'linear-gradient(135deg, #87E4F9 0%, #9DADFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                Live
                {/* {capitalize(task.is_live ? 'Live' : 'Coming Soon')} */}
              </Typography>
            ) : (
              <Typography
                variant="labelMedium"
                sx={{
                  display: 'inline-block',
                  color: colors.neutralSwatch.main[80],
                }}
              >
                Collected
                {/* {capitalize(task.is_live ? 'Live' : 'Coming Soon')} */}
              </Typography>
            )}
          </Box>
          <div className="tw-py-[4px]" aria-hidden="true"></div>
          <Typography
            variant="titleMedium"
            color={
              isLive
                ? colors.primarySwatch.main[10]
                : colors.neutralSwatch.main[50]
            }
            fontFamily={'Basier Circle'}
            textAlign={'left'}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {task.short_description || '-'}
          </Typography>
        </Box>
      </Card>
    </Link>
  );
};
