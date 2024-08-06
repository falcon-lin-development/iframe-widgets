import { LinksWidgetType } from '../../widgets/ProfileWidgetTypes';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import AttributeCardGridView from '../../../edit-profile/components/AttributeCard.gridview';
import colors from '@/styles/colors.config';
import { CommunityProfileLink } from '@/data/graphql/models/CommunityProfileLink/createCommunityProfileLink';
import { useProfileDesignPanel } from '../../contextProvider/ProfileDesignpanelContextProvider';
import { LinkDisplayCard } from '@/app/[locale]/c/(flows)/flow/onboarding/4.links';

type LinksWidgetEditorProp = {
  editedWidgetData: LinksWidgetType;
  setEditedWidgetData: Dispatch<SetStateAction<LinksWidgetType>>;
};

export const LinksWidgetEditor: React.FC<LinksWidgetEditorProp> = ({
  editedWidgetData,
  setEditedWidgetData,
}) => {
  const {
    state: {
      communityUserInfo: { communityProfile, isProfileInit },
    },
  } = useProfileDesignPanel();
  const userLinks = communityProfile?.links || [];
  const selectedLinks = editedWidgetData.attributes?.links || [];

  useEffect(() => {
    console.log({
      userLinks,
      selectedLinks,
    });
  }, [userLinks, selectedLinks]);

  const selectLink = (link: CommunityProfileLink) => {
    setEditedWidgetData((prev: LinksWidgetType) => {
      const _links = (prev?.attributes?.links || []).filter(
        (l) => l.id !== link.id || l.url !== link.url,
      );
      return {
        id: prev.id,
        type: prev.type,
        layout: prev.layout,
        attributes: {
          links: [..._links, link],
        },
      };
    });
  };

  const unSelectLink = (link: CommunityProfileLink) => {
    setEditedWidgetData((prev: LinksWidgetType) => {
      const _links = (prev?.attributes?.links || []).filter(
        (l) => l.id !== link.id || l.url !== link.url,
      );
      return {
        id: prev.id,
        type: prev.type,
        layout: prev.layout,
        attributes: {
          links: _links,
        },
      };
    });
  };

  const isLinkSelected = (link: CommunityProfileLink) => {
    return selectedLinks.some((l) => l.id === link.id && l.url === link.url);
  };

  return (
    <>
      <Box width="100%">
        <Box
          display="flex"
          //   justifyContent="space-between"
          justifyContent="flex-start"
          width="100%"
          sx={{
            alignItems: 'center',
          }}
        >
          <Typography
            variant="titleMedium"
            color={colors.neutralSwatch.main[30]}
            textAlign={'left'}
          >
            Selected Links
          </Typography>
        </Box>
        <Box sx={{ paddingTop: '12px' }} aria-label="spacer" />
        <Box
          display={'flex'}
          flexDirection={'column'}
          sx={{
            // use grid layout, and wrap to second row if more than 4
            // display: 'grid',
            // gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))',
            gap: '8px',
          }}
        >
          {userLinks.map((link, index) => (
            <LinkDisplayCard
              key={index}
              link={link}
              onClick={() => {
                if (isLinkSelected(link)) {
                  unSelectLink(link);
                } else {
                  selectLink(link);
                }
              }}
              sx={{
                borderColor: isLinkSelected(link)
                  ? colors.primarySwatch.main[40]
                  : undefined,
              }}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};
