'use client';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

// components
import { X } from 'lucide-react';
import { LoadingButton } from '@mui/lab';
import { Box, Dialog, Divider, IconButton, Typography } from '@mui/material';
import { TemplateGridBlock } from '../gridBlocks/GridBlock.template';
import colors from '@/styles/colors.config';

// hooks
import { isMobile } from 'react-device-detect';
import { useProfileDesignPanel } from '../../contextProvider/ProfileDesignpanelContextProvider';
// types
import {
  AttributesWidgetType,
  BaseProfileWidgetType,
  ItemLayoutZIndex,
  LinksWidgetType,
  ProfileWidgetTypes,
} from '../../widgets/ProfileWidgetTypes';

// editors
import { AttributesWidgetEditor } from './AttributesWidgetEditor';
import { EditGridBlock } from '../gridBlocks/GridBlock.editor';
import { LinksWidgetEditor } from './LinksWidgetEditor';

export const EditWidgetDialog: React.FC<{
  widget?: BaseProfileWidgetType | null;
  open: boolean;
  onClose: () => void;
}> = ({ widget, onClose, open }) => {
  if (!widget) {
    return null;
  }
  return <_EditWidgetDialog widget={widget} open={open} onClose={onClose} />;
};

const _EditWidgetDialog: React.FC<{
  widget: BaseProfileWidgetType;
  open: boolean;
  onClose: () => void;
}> = ({ widget, onClose, open }) => {
  const {
    isNewWidget,
    isCachedWidget,
    isDesignPanelWidget,
    originalWidgetData,
    editedWidgetData,
    setEditedWidgetData,
  } = _useEdigetWidgetDialogState(widget); // use parent logic to reset state
  const widgetType = originalWidgetData.type;

  const {
    state: {
      communityUserInfo: { communityProfile },
    },
    actions: { setDesignPanel, setCachePanel, setWidgestData },
  } = useProfileDesignPanel();

  const addWidget = (widget: BaseProfileWidgetType) => {
    setDesignPanel((prev) => {
      return [
        ...prev,
        {
          i: widget.id,
          x: widget.layout.x,
          y: widget.layout.y,
          w: widget.layout.w,
          h: widget.layout.h,
          // z: widget.layout.z,
          static: widget.layout.z === ItemLayoutZIndex.static,
        },
      ];
    });
    setWidgestData((prev) => {
      return {
        ...prev,
        [widget.id]: widget,
      };
    });
  };

  const editWidget = (widget: BaseProfileWidgetType) => {
    // edit widget doesn't change the layout
    setWidgestData((prev) => {
      return {
        ...prev,
        [widget.id]: widget,
      };
    });
  };

  if (!editedWidgetData) {
    return null;
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '430px', // max-width
            backgroundColor: colors.primarySwatch.lavender[98],
            // padding: '16px',
          },
        }}
        fullScreen
      >
        <>
          <Header
            onClose={onClose}
            onSubmit={() => {
              if (isNewWidget) {
                addWidget(editedWidgetData);
              } else {
                editWidget(editedWidgetData);
              }
              onClose();
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              height: isMobile ? 'unset' : '100%',

              width: '100%',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: colors.white,
              color: colors.neutralSwatch.main[30],
              gap: '24px',
            }}
          >
            {/* hi {originalWidgetData.id} {isNewWidget ? 'new' : 'old'} */}
            <Box
              sx={{
                backgroundColor: colors.primarySwatch.main[10],
                margin: '0 auto',
                borderRadius: '4px',
                maxWidth: '100%',
                // height: "80px",
                aspectRatio: `${editedWidgetData.layout.w}/${editedWidgetData.layout.h}`,
              }}
            >
              <EditGridBlock
                id={editedWidgetData.id}
                widgetData={editedWidgetData}
                sx={{
                  padding: 0,
                  // height: "auto",
                }}
              />
            </Box>
            <Box display={'block'} width={'100%'}>
              <Divider sx={{}} />
            </Box>

            <WidgetEditor
              editedWidgetData={editedWidgetData}
              setEditedWidgetData={setEditedWidgetData}
            />
          </Box>
        </>
      </Dialog>
    </>
  );
};

/**
 * Components
 */

// components
const Header: React.FC<{
  onClose: () => void;
  onSubmit: () => void;
}> = ({ onClose, onSubmit }) => {
  return (
    <Box // title
      sx={{
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '56px',
        padding: '10px 8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
        }}
      >
        <IconButton
          onClick={() => {
            onClose();
            // resetStates();
          }}
        >
          <X />
        </IconButton>
        <Typography
          variant="titleMedium"
          sx={{
            color: colors.neutralSwatch.main[10],
          }}
        >
          Edit
        </Typography>
      </Box>
      <LoadingButton
        onClick={() => {
          onSubmit();
        }}
      >
        <Typography
          variant="labelLarge"
          sx={
            {
              // color: colors.neutralSwatch.main[10],
            }
          }
        >
          Save
        </Typography>
      </LoadingButton>
    </Box>
  );
};

/**
 * Dialog Inners
 */
const WidgetEditor: React.FC<{
  editedWidgetData: BaseProfileWidgetType;
  setEditedWidgetData: Dispatch<SetStateAction<BaseProfileWidgetType | null>>;
}> = ({ editedWidgetData, setEditedWidgetData }) => {
  const { type } = editedWidgetData;
  if (type === ProfileWidgetTypes.AttributesWidget) {
    return (
      <AttributesWidgetEditor
        editedWidgetData={editedWidgetData as AttributesWidgetType}
        setEditedWidgetData={
          setEditedWidgetData as Dispatch<SetStateAction<AttributesWidgetType>>
        }
      />
    );
  } else if (type === ProfileWidgetTypes.LinksWidget) {
    return (
      <LinksWidgetEditor
        editedWidgetData={editedWidgetData as LinksWidgetType}
        setEditedWidgetData={
          setEditedWidgetData as Dispatch<SetStateAction<LinksWidgetType>>
        }
      />
    );
  } else {
    return <></>;
  }
};

// Page State
const _useEdigetWidgetDialogState = (widget: BaseProfileWidgetType) => {
  const {
    state: { widgetsData, designPanel, cachePanel },
    utils: { getfullWidgetDataFromPanelItem },
  } = useProfileDesignPanel();
  const thisWidgetData = useMemo(() => {
    return widgetsData[widget.id];
  }, [widget.id, widgetsData]);

  const isNewWidget = useMemo(() => {
    return !thisWidgetData;
  }, [thisWidgetData]);

  const isCachedWidget = useMemo(() => {
    if (isNewWidget) return false;
    return Boolean(cachePanel.find((item) => item.i === widget.id));
  }, [widget.id, cachePanel, isNewWidget]);

  const isDesignPanelWidget = useMemo(() => {
    if (isNewWidget) return false;
    return Boolean(designPanel.find((item) => item.i === widget.id));
  }, [widget.id, designPanel, isNewWidget]);

  const thisWidgetLayout = useMemo(() => {
    if (isNewWidget) {
      return widget.layout;
    } else {
      // search through designPanel and cachePanel
      if (isDesignPanelWidget) {
        const _layout = designPanel.find((item) => item.i === widget.id);
        const layout = {
          ..._layout,
          z: _layout?.static
            ? ItemLayoutZIndex.static
            : ItemLayoutZIndex.content,
        };
        return layout;
      } else if (isCachedWidget) {
        const _layout = cachePanel.find((item) => item.i === widget.id);
        const layout = {
          ..._layout,
          z: _layout?.static
            ? ItemLayoutZIndex.static
            : ItemLayoutZIndex.content,
        };
        return layout;
      } else {
        console.error('Widget not found in designPanel or cachePanel');
        alert('Widget not found in designPanel or cachePanel');
        return widget.layout;
      }
    }
  }, [widget.id, designPanel, cachePanel, isNewWidget]);

  const [editedWidgetData, setEditedWidgetData] =
    useState<BaseProfileWidgetType | null>(null);

  useEffect(() => {
    if (editedWidgetData === null) {
      setEditedWidgetData({
        id: thisWidgetData?.id || widget.id,
        type: thisWidgetData?.type || widget.type,
        layout: thisWidgetLayout, // x, y, w, h, z will exist
        attributes: thisWidgetData?.attributes || widget.attributes,
      } as BaseProfileWidgetType);
    }
  }, [widget, thisWidgetData, thisWidgetLayout, editedWidgetData]);

  return {
    isNewWidget,
    isCachedWidget,
    isDesignPanelWidget,
    originalWidgetData: widget,
    editedWidgetData,
    setEditedWidgetData,
  };
};
