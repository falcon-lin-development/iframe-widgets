import { Typography, IconButton, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { ComponentIcon } from 'lucide-react';
import {
  useProfileDesignPanel,
  PanelItem,
} from '../contextProvider/ProfileDesignpanelContextProvider';
import { EditGridBlock } from './gridBlocks/GridBlock.editor';
import colors from '@/styles/colors.config';

export const BotToolBar: React.FC<{
  isToolBoxOpen: boolean;
  setIsWidgetsSheetOpen: (value: boolean) => void;
}> = ({ isToolBoxOpen, setIsWidgetsSheetOpen }) => {
  return (
    <>
      {isToolBoxOpen && (
        <Box
          component={motion.div}
          // show toolbar from bottom up
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 200, // Adjust as needed
            // height: '10%', // Adjust as needed
            // paddingY: '16px',
            paddingX: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            display: 'block',
            // display: 'flex',
            // flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Add your toolbar content here */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white',
              padding: '8px',
            }}
          >
            <Typography
              variant="titleMedium"
              sx={{
                transform: 'translateY(2px)',
              }}
            >
              Archived Widgets
            </Typography>
            <IconButton onClick={() => setIsWidgetsSheetOpen(true)}>
              <ComponentIcon size={18} color={colors.white} />
            </IconButton>
          </Box>
          <ArchivedArea />
        </Box>
      )}
    </>
  );
};

const ArchivedArea: React.FC = () => {
  const {
    state: { cachePanel },
    actions: { setCachePanel },
    utils: { getfullWidgetDataFromPanelItem },
    dragAndDrop: {
      desktop: {
        draggingItem,
        isDraggingItemDroppable,
        DROPPING_ITEM_ID,
        onCrossDragStart,
        onCrossDragEnd,
      },
      mobile: { onDnDClick },
    },
  } = useProfileDesignPanel();

  const lsItems = cachePanel.map((widget: PanelItem, index: number) => {
    return (
      <Box
        className="archived-widget-card"
        draggable={true}
        key={index}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'transparent',
          // border: '1px dashed white',
          boxShadow: '0 0 4px 0 rgba(255, 255, 255, 0.5)',
          borderRadius: '4px',
          // height: 'inherit',
          maxHeight: '130px',
          // aspectRatio: '1 / 1',
        }}
        onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
          onCrossDragStart(widget);
        }}
        onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
          // reset dragging item if cancelled
          onCrossDragEnd();
        }}
        onClick={() => {
          onDnDClick(widget);
          console.log('clicked, ', widget);
        }}
      >
        <Box
          className="archived-widget-wrapper"
          sx={{
            aspectRatio: '1 / 1',
            overflow: 'hidden',
          }}
        >
          <EditGridBlock
            id={widget.i}
            widgetData={getfullWidgetDataFromPanelItem({
              item: widget,
              fromPanel: 'cache',
            })}
          />
        </Box>
        <Box
          flexGrow={1}
          display={'flex'}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            transform: 'translateY(1px)',
          }}
        >
          <Typography variant="labelSmall">
            {widget.h}x{widget.w}
          </Typography>
        </Box>
      </Box>
    );
  });

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '16px',
          paddingX: '8px',
          // gap: '16px',
          flexWrap: 'wrap', // Ensure items wrap within the container
        }}
      >
        {lsItems}
      </Box>
    </>
  );
};
