'use client';
import { Box, Typography } from '@mui/material';
import React from 'react';

// hooks
import { LinksWidgetType } from './ProfileWidgetTypes';
import { LinkDisplayCard } from '@/app/[locale]/c/(flows)/flow/onboarding/4.links';
import { LinkTagDisplay } from '../../v/default/PublicProfilePage';
import { ChevronRightIcon } from 'lucide-react';
import colors from '@/styles/colors.config';
import { CommunityProfileLink } from '@/data/graphql/models/CommunityProfileLink/createCommunityProfileLink';
// avatar widget

type LinksWidgetProp = {
  defaultLink?: CommunityProfileLink;
  widgetData: LinksWidgetType;
};

export const LinksWidget: React.FC<LinksWidgetProp> = ({
  widgetData,
  defaultLink,
}) => {
  const links = widgetData.attributes?.links;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        color: 'black',
      }}
    >
      {links && links.length > 0 ? (
        <>
          {links.slice(0, 1).map((link) => (
            <LinkTagDisplay
              key={link.id}
              link={{
                id: link?.id || '',
                url: link.url,
                title: link?.title || '',
                icon: link?.icon || '',
                tracking_url: link.tracking_url,
              }}
            />
          ))}
          {links.length > 1 && (
            <>
              <Box paddingRight={'16px'} aria-label="spacer" />
              <Typography variant="labelMedium" color="white">
                More
              </Typography>
              <Box paddingRight={'8px'} aria-label="spacer" />
              <ChevronRightIcon size={24} color={colors.white} />
            </>
          )}
        </>
      ) : (
        <>
          {defaultLink ? (
            <>
              <LinkTagDisplay key={defaultLink.id} link={defaultLink} />
            </>
          ) : (
            <>
              <Box
                sx={{
                  padding: '10px',
                }}
              >
                <Typography
                  variant="labelSmall"
                  sx={{
                    textWrap: 'nowrap',
                    color: 'white',
                  }}
                >
                  {links?.length || 0} links selected
                </Typography>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
};
