import { Theme } from '@emotion/react';
import { Box, SxProps } from '@mui/material';
import { useProfileDesignPanel } from '../../contextProvider/ProfileDesignpanelContextProvider';

import {
  BaseProfileWidgetType,
  ProfileWidgetTypes,
  UserNameWidgetType,
  BioWidgetType,
  AttributesWidgetType,
  LinksWidgetType,
} from '../../widgets/ProfileWidgetTypes';

// widgets
import { DefaultGridBlock } from './DefaultGridBlock';
import { UserNameWidget } from '../../widgets/UserNameWidget';
import { AttributesWidget } from '../../widgets/AttributesWidget';
import { AvatarWidget } from '../../widgets/AvatarWidget';
import { BioWidget } from '../../widgets/BioWidget';
import { MootiezBrandingWidget } from '../../widgets/MootiezBrandingWidget';
import { LinksWidget } from '../../widgets/LinksWidget';

/**
 * dynamic grid items
 */
export const TemplateGridBlock: React.FC<{
  id: string;
  widgetData?: BaseProfileWidgetType;
  sx?: SxProps<Theme>;
}> = ({ id, widgetData, sx }) => {
  return (
    <Box
      sx={{
        height: '100%',
        ...sx,
      }}
    >
      <TemplateGridBlockInner id={id} widgetData={widgetData} />
    </Box>
  );
};

const TemplateGridBlockInner: React.FC<{
  id: string;
  widgetData?: BaseProfileWidgetType;
  sx?: SxProps<Theme>;
}> = ({ id, widgetData, sx }) => {
  const {
    state: {
      communityUserInfo: { communityProfile },
    },
  } = useProfileDesignPanel();

  if (!widgetData) return <DefaultGridBlock id={id} />;

  const widgetType = widgetData.type;
  if (widgetType === ProfileWidgetTypes.MootiezBrandingWidget) {
    return <MootiezBrandingWidget />;
  } else if (widgetType === ProfileWidgetTypes.AvatarWidget) {
    return <AvatarWidget userAvatarUrl={communityProfile.profile_avatar_url} />;
  } else if (widgetType === ProfileWidgetTypes.UserNameWidget) {
    return (
      <UserNameWidget
        displayName={communityProfile.profile_name}
        userHandle={communityProfile.persona.user_handle}
        widgetData={widgetData as UserNameWidgetType}
      />
    );
  } else if (widgetType === ProfileWidgetTypes.BioWidget) {
    return (
      <BioWidget
        bio={communityProfile.profile_bio}
        widgetData={widgetData as BioWidgetType}
      />
    );
  } else if (widgetType === ProfileWidgetTypes.AttributesWidget) {
    return (
      <AttributesWidget
        defaultAttribute={{
          badgeMetadata: {
            cta: '{"target": "iframe", "url": "https://www.mootiez.com/attribute-details/mbti/entj"}',
            community_id: '1770071e-0000-0000-0000-1770071e7000',
            point_id:
              'badge#1770071e-0000-0000-0000-1770071e7000#attribute#mbti#entj',
            free_claim: true,
            img_url:
              'https://community-assets.dttd.io/mootiez/attributes/assets/MBTI/details/ENTJ.png',
            display_name: 'Chess Master',
            thumbnail_url:
              'https://community-assets.dttd.io/mootiez/attributes/assets/MBTI/thumbnails/ENTJ.png',
          },
          balance: 1,
          communityId: '1770071e-0000-0000-0000-1770071e7000',
          pointId:
            'badge#1770071e-0000-0000-0000-1770071e7000#attribute#mbti#entj',
          personaId: 'dc337266-5ee2-4b74-a439-4af37facb60a',
        }}
        widgetData={widgetData as AttributesWidgetType}
      />
    );
  } else if (widgetType === ProfileWidgetTypes.LinksWidget) {
    return (
      <LinksWidget
        widgetData={widgetData as LinksWidgetType}
        defaultLink={{
          id: '1',
          url: 'https://www.mootiez.com',
          title: 'Mootiez',
          icon: 'https://community-assets.dttd.io/mootiez/links/assets/mootiez.png',
          tracking_url: 'https://www.mootiez.com',
        }}
      />
    );
  } else {
    return <DefaultGridBlock id={id} />;
  }
};
