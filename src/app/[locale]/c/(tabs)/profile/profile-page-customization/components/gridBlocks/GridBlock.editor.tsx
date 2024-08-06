'use client';

import colors from '@/styles/colors.config';
import { Box as _Box, SxProps, Theme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { EditIcon, ArchiveIcon, DeleteIcon, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useLongPress } from 'use-long-press';
import { useProfileDesignPanel } from '../../contextProvider/ProfileDesignpanelContextProvider';
import {
  AttributesWidgetType,
  BaseProfileWidgetType,
  BioWidgetType,
  LinksWidgetType,
  ProfileWidgetTypes,
  UserNameWidgetType,
} from '../../widgets/ProfileWidgetTypes';
import { MootiezBrandingWidget } from '../../widgets/MootiezBrandingWidget';
import { AvatarWidget } from '../../widgets/AvatarWidget';
import { GridBlockFocusedModal } from './GridBlockFocusedModal';
import { UserNameWidget } from '../../widgets/UserNameWidget';
import { BioWidget } from '../../widgets/BioWidget';
import { DefaultGridBlock } from './DefaultGridBlock';
import { EditWidgetDialog } from '../widgetEditors/EditWidgetDialog';
import { AttributesWidget } from '../../widgets/AttributesWidget';
import { LinksWidget } from '../../widgets/LinksWidget';

const Box = motion(_Box);

/**
 *
 * @returns Grids
 */
interface FocusableEditGridBlockProps {
  // children?: React.ReactNode;
  id: string;
  blockData: BaseProfileWidgetType;
  sx?: SxProps<Theme>;
  focused?: boolean;
  setNotFocused?: () => void;
}

export const FocusableEditGridBlock: React.FC<FocusableEditGridBlockProps> = ({
  id,
  blockData,
  sx,
  focused,
  setNotFocused,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const {
    state: {
      designPanel,
      cachePanel,
      communityUserInfo: { communityProfile },
    },
    actions: { setDesignPanel, setCachePanel, setWidgestData },
    dragAndDrop: { onArchive },
  } = useProfileDesignPanel();
  const [currentEditingWidget, setCurrentEditingWidget] =
    useState<BaseProfileWidgetType | null>(null);

  const deleteWidget = () => {
    // remove from designPanel, cachePanel, widgetsData
    const newDesignPanel = designPanel.filter((item) => item.i !== id);
    setDesignPanel(newDesignPanel);
    const newCachePanel = cachePanel.filter((item) => item.i !== id);
    setCachePanel(newCachePanel);
    setWidgestData((prev) => {
      const newPanel = { ...prev };
      delete newPanel[id];
      return newPanel;
    });
  };

  const content = (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        ...sx,
      }}
      ref={gridRef}
    >
      <Box
        height={'100%'}
        animate={
          focused
            ? {
                scale: [1, 1.05, 1.02],
                // boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
                filter: 'drop-shadow(0px 5px 5px rgba(0,0,0,0.3))',
              }
            : {
                scale: [1.02, 1],
                boxShadow: 'none',
                filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0))',
                // filter: "unset",
              }
        }
        transition={{
          duration: 0.3,
          times: [0, 0.6, 1], // This means the scale will be 1.05 at 60% of the animation
          ease: 'easeOut',
        }}
      >
        <EditGridBlock id={id} widgetData={blockData} />
        {/* <DefaultGridBlockInner id={id} /> */}
      </Box>
    </Box>
  );

  return (
    <>
      {/* the real content */}
      {content}
      {/* the modal content */}
      <GridBlockFocusedModal
        id={id}
        focused={Boolean(focused)}
        gridRef={gridRef}
        handleClose={() => setNotFocused && setNotFocused()}
        content={content}
        // dimensions={dimensions}
        onArchive={() => {
          const thisItem = designPanel.find((item) => item.i === id);
          thisItem && onArchive(thisItem);
        }}
        onDelete={() => {
          deleteWidget();
        }}
        onEdit={() => {
          setCurrentEditingWidget(blockData);
        }}
      />
      {Boolean(currentEditingWidget) && (
        <EditWidgetDialog
          widget={currentEditingWidget}
          open={Boolean(currentEditingWidget)}
          onClose={() => setCurrentEditingWidget(null)}
        />
      )}
    </>
  );
};

/**
 * dynamic grid items
 */

export const EditGridBlock: React.FC<{
  id: string;
  widgetData?: BaseProfileWidgetType;
  sx?: SxProps<Theme>;
}> = ({ id, widgetData, sx }) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        ...sx,
      }}
    >
      <EditGridBlockInner id={id} widgetData={widgetData} />
    </Box>
  );
};
const EditGridBlockInner: React.FC<{
  id: string;
  widgetData?: BaseProfileWidgetType;
}> = ({ id, widgetData }) => {
  const {
    state: {
      communityUserInfo: { communityProfile },
    },
  } = useProfileDesignPanel();
  const widgetType = widgetData?.type;

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
    return <AttributesWidget widgetData={widgetData as AttributesWidgetType} />;
  } else if (widgetType === ProfileWidgetTypes.LinksWidget) {
    return <LinksWidget widgetData={widgetData as LinksWidgetType} />;
  } else {
    return <DefaultGridBlock id={id} />;
  }
};
