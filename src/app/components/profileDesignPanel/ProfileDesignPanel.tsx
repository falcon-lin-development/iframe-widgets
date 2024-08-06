'use client';
import { Box, Icon, IconButton, Typography } from '@mui/material';
import React, { useState, useEffect, useRef, useMemo, cache } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { motion } from 'framer-motion';
import ProfileBGOptions from '@/styles/bgOptions/ProfileBGOptions';

// css
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../../css/CustomGridLayout.css'; // Import the custom CSS
import style from '../../css/ProfileDesignPanel.module.css';

// GridBlock component
import { FocusableEditGridBlock } from '../gridBlocks/GridBlock.editor';

// components
import { WidgetsSelectionSheet } from '../SelectWidgetsBottomSheet';
import { TopToolBar } from '../TopToolBar';
import { BotToolBar } from '../BotToolBar';

// hooks
import { isMobile } from 'react-device-detect';
import { PanelState, useDesignPanelState } from './useDesignPanelState';
import { EditWidgetDialog } from '../widgetEditors/EditWidgetDialog';
import { BaseProfileWidgetType } from '../../widgets/ProfileWidgetTypes';
import { DotIcon } from 'lucide-react';

/**
 * ProfileDesignPanel
 */
const ResponsiveGridLayout = WidthProvider(Responsive);
export const ProfileDesignPanel: React.FC = () => {
  /**
   * This one control the toolbox
   * */
  const {
    meta: { rowHeight },
    ref: { panelRef },
    state: {
      updateCommunityProfileWidgetDraftState,
      isToolBoxOpen,
      designPanel,
      panelState,
      focusedGridId,
      widgetsData,
      isWidgetsSheetOpen,
      showGridLines,
    },
    actions: { toggleToolBoxOpen, unFocusGrid, setIsWidgetsSheetOpen },
    utils: {
      getfullWidgetDataFromPanelItem,
      onLayoutChange,
      itemLocationValid,
      // onCrossDrop,
      onDragStart,
      onDragging,
      onDragStop,
      onDrop,
      onDragOver,
    },
  } = useDesignPanelState();
  const [currentEditingWidget, setCurrentEditingWidget] =
    useState<BaseProfileWidgetType | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    null | 'updating' | 'updated'
  >(null);

  useEffect(() => {
    if (
      updateCommunityProfileWidgetDraftState.data &&
      updateCommunityProfileWidgetDraftState.stale === false
    ) {
      setAutoSaveStatus('updated');
      setTimeout(() => {
        updateCommunityProfileWidgetDraftState.stale = true;
        setAutoSaveStatus(null);
      }, 3000);
    } else if (updateCommunityProfileWidgetDraftState.fetching) {
      setAutoSaveStatus('updating');
    } else {
      setAutoSaveStatus(null);
    }
  }, [updateCommunityProfileWidgetDraftState]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          position: 'relative',
        }}
        onClick={() => {
          // @dev this is working, but not sure if this is the best way to do it
          panelState === PanelState.FOCUSED && unFocusGrid && unFocusGrid();
          panelState === PanelState.TOOL_BOX && toggleToolBoxOpen();
        }}
      >
        <Box
          ref={panelRef}
          sx={{
            // backgroundColor: 'lightblue',
            background: ProfileBGOptions[0].background,
            aspectRatio: '6 / 11',
            position: 'relative',
            transition: 'transform 0.3s ease',
            //@dev undefined is important here, otherwise zIndex of grid blocks would be affected
            // transform: panelState === PanelState.TOOL_BOX ? 'scale(0.9)' : undefined,
            transform: isToolBoxOpen ? 'scale(0.9)' : undefined,
            transformOrigin: 'center',
          }}
        >
          {showGridLines && (
            <Box
              id="grid-panel-box"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: 'none',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  // backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
                  backgroundSize: `${100 / 6}% ${100 / 11}%`,
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px) // vertical lines
                  `,
                  maskImage: `
                    linear-gradient(0deg, rgba(0,0,0,0.5) 5%, transparent 5%, transparent 95%, rgba(0,0,0,0.5) 95%)
                `,
                  maskSize: `${100 / 6}% ${100 / 11}%`,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundSize: `${100 / 6}% ${100 / 11}%`,
                  backgroundImage: `
                    linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px) // horizontal lines 
                  `,
                  maskImage: `
                    linear-gradient(90deg, rgba(0,0,0,0.5) 5%, transparent 5%, transparent 95%, rgba(0,0,0,0.5) 95%)
                  `,
                  maskSize: `${100 / 6}% ${100 / 11}%`,
                },
              }}
            />
          )}
          <ResponsiveGridLayout
            className="layout"
            layouts={{
              lg: designPanel,
            }}
            // dimensions
            breakpoints={{ lg: 1200 }}
            cols={{ lg: 6 }}
            maxRows={11}
            rowHeight={rowHeight}
            containerPadding={[0, 0]}
            margin={[0, 0]}
            style={{
              height: '100%',
            }}
            // features
            isDraggable={panelState === PanelState.TOOL_BOX ? false : true}
            preventCollision={true}
            isResizable={false}
            compactType={null}
            // D & D
            onLayoutChange={onLayoutChange}
            onDragStart={onDragStart}
            onDrag={onDragging}
            onDragStop={onDragStop}
            isDroppable={true}
            onDrop={onDrop}
            onDropDragOver={onDragOver}
          >
            {designPanel.map((block) => {
              return (
                <div
                  key={block.i}
                  className={`
                ${style.elementToDisableSelection} 
                ${panelState === PanelState.FOCUSED && focusedGridId === block.i && style.elevated}
                ${!itemLocationValid(block) && style.locationInvalid}
              `}
                >
                  <FocusableEditGridBlock
                    id={block.i}
                    blockData={getfullWidgetDataFromPanelItem({
                      item: block,
                      fromPanel: 'design',
                    })}
                    focused={
                      panelState === PanelState.FOCUSED &&
                      focusedGridId === block.i
                    }
                    setNotFocused={unFocusGrid}
                  />
                </div>
              );
            })}
          </ResponsiveGridLayout>
        </Box>

        {/* Floating button */}
        <OpenToolBoxButton
          isToolBoxOpen={panelState === PanelState.TOOL_BOX}
          toggleToolBoxOpen={toggleToolBoxOpen}
        />

        {/* Top Toolbar space (only visible when panel is shrunk) */}
        <TopToolBar
          isToolBoxOpen={
            // panelState === PanelState.TOOL_BOX
            isToolBoxOpen
          }
        />
        {/* Bot Toolbar space (only visible when panel is shrunk) */}
        <BotToolBar
          isToolBoxOpen={
            // panelState === PanelState.TOOL_BOX
            isToolBoxOpen
          }
          setIsWidgetsSheetOpen={setIsWidgetsSheetOpen}
        />
      </Box>
      {/* widgets selection sheet */}
      <WidgetsSelectionSheet
        open={isWidgetsSheetOpen}
        onCreateWidget={(widgetOption: BaseProfileWidgetType) => {
          // open edit widget dialog
          // use the widget, with selected widgetId, data & layout

          // if not data is found, it effectively means that the widget is not yet added to the panel
          // otherwise, it just edit the existing widget

          // when saved,
          // 1) remove from cache & design
          // 2) add to design
          // 3) fire update to server
          setCurrentEditingWidget(widgetOption);
        }}
        onClose={() => setIsWidgetsSheetOpen(false)}
      />

      {/* Edit Widget Dialog */}
      {Boolean(currentEditingWidget) && (
        <EditWidgetDialog
          widget={currentEditingWidget}
          open={Boolean(currentEditingWidget)}
          onClose={() => setCurrentEditingWidget(null)}
        />
      )}

      {/* status Dot */}
      <Box
        sx={{
          position: 'fixed',
          top: '5px',
          right: '5px',
          zIndex: 1,
        }}
      >
        <DotIcon
          size={60}
          color={
            autoSaveStatus === 'updating'
              ? 'orange'
              : autoSaveStatus === 'updated'
                ? 'green'
                : 'lightgray'
          }
        />
      </Box>
    </>
  );
};

/**
 * OpenToolBoxButton
 */
const OpenToolBoxButton: React.FC<{
  isToolBoxOpen: boolean;
  toggleToolBoxOpen: () => void;
}> = ({ isToolBoxOpen, toggleToolBoxOpen }) => {
  const mobileBtn = (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.1 }}
      animate={{ y: isToolBoxOpen ? -200 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={(e) => {
        e.stopPropagation();
        toggleToolBoxOpen();
      }}
      sx={{
        position: 'fixed',
        bottom: '0px',
        right: '20px',
        // size
        height: '20px',
        aspectRatio: '2 / 1',
        // width: '60px',

        // style
        // backgroundColor: 'primary.main',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        opacity: 0.5,
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        borderRadius: '4px 4px 0 0',

        // center the text
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isToolBoxOpen ? '↓' : '↑'}
    </Box>
  );

  const desktopBtn = (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        toggleToolBoxOpen();
      }}
      sx={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        // size
        width: '50px',
        height: '50px',
        borderRadius: '50%',

        // style
        // backgroundColor: 'primary.main',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        opacity: 0.5,
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',

        // center the text
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      }}
    >
      {isToolBoxOpen ? '↓' : '↑'}
    </Box>
  );
  {
    /* Floating button */
  }
  return isMobile ? mobileBtn : desktopBtn;
};
