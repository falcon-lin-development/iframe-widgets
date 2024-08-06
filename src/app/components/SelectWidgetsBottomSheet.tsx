'use client';
import { Box, Typography } from '@mui/material';
import {
  AvatarWidgetType,
  BaseProfileWidgetType,
  UserNameWidgetType,
  ProfileWidgetTypes,
  ItemLayoutZIndex,
  AttributesWidgetType,
  LinksWidgetType,
} from '../widgets/ProfileWidgetTypes';
import Sheet from 'react-modal-sheet';
import colors from '@/styles/colors.config';
// import { EditGridBlock } from './gridBlocks/GridBlock.editor';
import { TemplateGridBlock } from './gridBlocks/GridBlock.template';

const WidgetOptionList: BaseProfileWidgetType[] = [
  {
    id: ProfileWidgetTypes.AvatarWidget,
    type: ProfileWidgetTypes.AvatarWidget,
    layout: {
      x: 0,
      y: 0,
      z: ItemLayoutZIndex.content,
      w: 6,
      h: 6,
    },
  } as AvatarWidgetType,
  {
    id: ProfileWidgetTypes.UserNameWidget,
    type: ProfileWidgetTypes.UserNameWidget,
    layout: {
      x: 0,
      y: 0,
      z: ItemLayoutZIndex.content,
      w: 4,
      h: 1,
    },
  } as UserNameWidgetType,
  {
    id: ProfileWidgetTypes.BioWidget,
    type: ProfileWidgetTypes.BioWidget,
    layout: {
      x: 0,
      y: 0,
      z: ItemLayoutZIndex.content,
      w: 6,
      h: 1,
    },
  } as UserNameWidgetType,
  {
    id: ProfileWidgetTypes.AttributesWidget,
    type: ProfileWidgetTypes.AttributesWidget,
    layout: {
      x: 0,
      y: 0,
      z: ItemLayoutZIndex.content,
      w: 6,
      h: 1,
    },
  } as AttributesWidgetType,
  {
    id: ProfileWidgetTypes.LinksWidget,
    type: ProfileWidgetTypes.LinksWidget,
    layout: {
      x: 0,
      y: 0,
      z: ItemLayoutZIndex.content,
      w: 6,
      h: 1,
    },
  } as LinksWidgetType,
];

/**
 * WidgetsSelectionSheet
 */
export const WidgetsSelectionSheet: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreateWidget?: (widgetOption: BaseProfileWidgetType) => void;
}> = ({ open, onClose, onCreateWidget }) => {
  return (
    <>
      <Sheet
        isOpen={open}
        onClose={onClose}
        // detent="content-height"
        detent="full-height"
        style={{
          color: colors.neutralSwatch.main[30],
          // zIndex: 1400,
        }}
      >
        <Sheet.Container>
          <Sheet.Content>
            <Box
              sx={{
                // background: colors.accentInfo,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '16px',
              }}
            >
              <Typography
                variant="titleMedium"
                sx={{
                  transform: 'translateY(2px)',
                }}
              >
                Select Widgets
              </Typography>
              <Box
                // make it a grid view width dynamic columns
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '16px',
                }}
              >
                {WidgetOptionList.map((widgetOption) => (
                  <OptionBlock
                    key={widgetOption.id}
                    widgetOption={widgetOption}
                    onClose={onClose}
                    onCreateWidget={onCreateWidget}
                  />
                ))}
              </Box>
            </Box>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop
          onTap={(e) => {
            e.preventDefault();
            onClose();
          }}
        />
      </Sheet>
    </>
  );
};

const OptionBlock: React.FC<{
  widgetOption: BaseProfileWidgetType;
  onClose: () => void;
  onCreateWidget?: (widgetOption: BaseProfileWidgetType) => void;
}> = ({ widgetOption, onClose, onCreateWidget }) => {
  const generateWidgetId = (widgetType: string) => {
    if (
      widgetType === ProfileWidgetTypes.AttributeWidget
      // || widgetType === ProfileWidgetTypes.
    ) {
      return `${widgetType}-${Date.now()}`;
    }
    return widgetType;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.neutralSwatch.main[30],
        boxShadow: '0 0 4px 0 rgba(255, 255, 255, 0.5)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
      onClick={() => {
        if (onCreateWidget) {
          onCreateWidget({
            ...widgetOption,
            id: generateWidgetId(widgetOption.id),
          });
        }
        onClose();
      }}
    >
      <TemplateGridBlock id={widgetOption.id} widgetData={widgetOption} />
      <Box
        flexGrow={1}
        display={'flex'}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: 'translateY(1px)',
        }}
      >
        <Typography variant="labelSmall" color={colors.neutralSwatch.main[98]}>
          {widgetOption.layout.w}x{widgetOption.layout.h}
        </Typography>
      </Box>
    </Box>
  );
};
