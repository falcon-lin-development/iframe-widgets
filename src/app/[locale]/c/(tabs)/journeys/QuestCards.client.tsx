'use client';
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Typography,
  Skeleton,
} from '@mui/material';
import { capitalize } from '@mui/material/utils';
import { Quest } from '@/data/services/fetchCommunityQuestsService';
import Image from 'next/image';
import colors from '@/styles/colors.config';

import { QuestChip } from '@/components/QuestChip';
import Link from 'next/link';
// constants
import assets from '@/constants';

type QuestImageCardProps = {
  quest: Quest;
  href?: string;
  onClick?: () => void;
  aspectRatio?: string;
};

const LinkWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  href?: string;
  id?: string;
  dataGtm?: string;
}> = ({ children, href, id, className, dataGtm }) => {
  return (
    <>
      {href ? (
        <Link
          key={id}
          className={className}
          id={id}
          data-gtm={dataGtm}
          href={href}
        >
          {children}
        </Link>
      ) : (
        <Box key={id} id={id} className={className} data-gtm={dataGtm}>
          {children}
        </Box>
      )}
    </>
  );
};

const HeroQuestImageCard: React.FC<QuestImageCardProps> = ({
  quest,
  href,
  onClick,
  aspectRatio = '3/4',
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  return (
    <LinkWrapper
      id={`hero-quest-card-${quest.quest_id}`}
      dataGtm={`hero-quest-card-${quest.quest_id}`}
      className="hero-quest-card"
      href={href}
      // onClick={onClick}
    >
      <Card
        onClick={onClick}
        variant="outlined"
        sx={{
          position: 'relative',
          borderRadius: '0.5rem',
          backgroundColor: colors.primarySwatch.main[98],
          '&:hover': {
            cursor: 'pointer',
          },
        }}
      >
        {/* {isLoading && (
          <ShimmerThumbnail height={250} rounded styles={{
            aspectRatio: aspectRatio
          }} />
        )} */}
        <CardMedia
          component="img"
          image={quest.thumbnail_img_path || assets.images.quizzes.defaultIcon}
          alt="Quest Image"
          // onLoad={() => setIsLoading(false)} // Set loading to false when the image has loaded
          sx={{
            aspectRatio: aspectRatio,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // display: isLoading ? 'none' : 'block', // Hide the image while it's loading
          }}
        />

        <Box
          sx={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.01) 40%)', // Fading effect
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0, // Position at the bottom of the image
            left: 0,
            width: '100%', // Take up all available width
            color: 'white', // Text color
            padding: '12px', // Padding around the text
            gap: '4px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant="labelLarge" component={'div'}>
            {capitalize(quest.quest_category || quest.quest_type)}
          </Typography>{' '}
          <Typography
            variant="titleLarge"
            component={'div'}
            sx={{
              textAlign: 'left',
            }}
          >
            {capitalize(
              quest.quest_title && quest.quest_title.toLocaleLowerCase(),
            )}
          </Typography>{' '}
        </Box>
      </Card>
    </LinkWrapper>
  );
};

const QuestImageCard: React.FC<QuestImageCardProps> = ({
  quest,
  href,
  onClick,
}) => {
  return (
    <LinkWrapper
      id={`quest-card-${quest.quest_id}`}
      dataGtm={`quest-card-${quest.quest_id}`}
      className="quest-card"
      href={href}
    >
      <Card
        onClick={onClick}
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
        }}
      >
        <Image
          src={quest.thumbnail_img_path || assets.images.quizzes.defaultIcon}
          alt="Avatar"
          width={84}
          height={84}
          style={{
            borderRadius: '8px',
            width: 84,
            height: 84,
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
            <QuestChip text={quest.quest_type} />
            <div className="tw-w-full" aria-hidden="true"></div>
            <div className="label-medium tw-text-neutralSwatch-80">live</div>
          </Box>
          <div className="tw-py-[4px]" aria-hidden="true"></div>
          <div
            className="title-medium tw-text-primarySwatch-10"
            style={{
              // display: -webkit-box;
              // -webkit-line-clamp: 2; /* Number of lines you want */
              // -webkit-box-orient: vertical;
              // overflow: hidden;
              // text-overflow: ellipsis;

              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {quest.quest_title && quest.quest_title.toLocaleLowerCase()}
            {/* Invite your friends to complete the MBTI test and... */}
          </div>
        </Box>
      </Card>
    </LinkWrapper>
  );
};

export { HeroQuestImageCard, QuestImageCard };
