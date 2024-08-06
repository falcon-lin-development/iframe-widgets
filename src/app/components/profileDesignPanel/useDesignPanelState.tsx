import useReactGridLayoutLongPress from '@/utils/useReactGridLayoutLongPress';
import { useState, useRef, useMemo, useEffect } from 'react';
import { Layout, DragOverEvent } from 'react-grid-layout';
import { useProfileDesignPanel } from '../../contextProvider/ProfileDesignpanelContextProvider';

/**
 * States
 */
export enum PanelState {
  NORMAL = 'NORMAL', // support drag and longpress
  FOCUSED = 'FOCUSED',
  TOOL_BOX = 'TOOL_BOX',
  DRAG_AND_DROP = 'DRAG_AND_DROP',
}

/**
 * hooks
 */
const _useLongPress = () => {
  /**
   * This one control the focused fird
   */
  const [focusedGridId, setFocusedGridId] = useState<string | null>(null);

  const {
    onDragStart: onFocusDragStart,
    onDrag: onFocusDrag,
    onDragEnd: onFocusDragEnd,
  } = useReactGridLayoutLongPress({
    onLongPress: (gridId: string) => {
      setFocusedGridId(gridId);
    },
    duration: 1000,
  });

  return {
    focusedGridId,
    setFocusedGridId,
    onFocusDragStart,
    onFocusDrag,
    onFocusDragEnd,
  };
};

export const useDesignPanelState = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [rowHeight, setRowHeight] = useState<number>(30);
  const [isToolBoxOpen, setisToolBoxOpen] = useState(false);
  const [isWidgetsSheetOpen, setIsWidgetsSheetOpen] = useState(false);
  const [showGridLines, setShowGridLines] = useState(false);

  const {
    state: { designPanel, widgetsData, updateCommunityProfileWidgetDraftState },
    // actions: {},
    utils: {
      onLayoutChange,
      itemLocationValid,
      getfullWidgetDataFromPanelItem,
    },
    dragAndDrop: {
      desktop: {
        DROPPING_ITEM_ID,
        draggingItem,
        onCrossDragEnd,
        onCrossDragging,
        onCrossDrop,
      },
    },
  } = useProfileDesignPanel();
  const {
    focusedGridId,
    setFocusedGridId,
    onFocusDragStart,
    onFocusDrag,
    onFocusDragEnd,
  } = _useLongPress();

  const panelState = useMemo(() => {
    if (draggingItem) {
      return PanelState.DRAG_AND_DROP;
    } else if (isToolBoxOpen) {
      return PanelState.TOOL_BOX;
    } else if (Boolean(focusedGridId)) {
      return PanelState.FOCUSED;
    } else {
      return PanelState.NORMAL;
    }
  }, [draggingItem, focusedGridId, isToolBoxOpen]);

  /**
   * USE EFFECTs
   */
  useEffect(() => {
    // set row height
    const updateRowHeight = () => {
      if (panelRef.current) {
        const gridWidth = panelRef.current.offsetWidth;
        const cellWidth = gridWidth / 6; // 6 columns
        setRowHeight(cellWidth);
      }
    };

    updateRowHeight();
    window.addEventListener('resize', updateRowHeight);

    return () => {
      window.removeEventListener('resize', updateRowHeight);
    };
  }, []);

  useEffect(() => {
    console.log('panelState: ', panelState);
  }, [panelState]);

  return {
    meta: {
      DROPPING_ITEM_ID,
      rowHeight,
    },
    ref: {
      panelRef,
    },
    state: {
      panelState,
      designPanel,
      // draggingItem,
      isToolBoxOpen,
      isWidgetsSheetOpen,
      focusedGridId,
      widgetsData,
      showGridLines,
      updateCommunityProfileWidgetDraftState,
    },
    actions: {
      toggleToolBoxOpen: () => {
        setisToolBoxOpen((prev) => !prev);
      },
      setIsWidgetsSheetOpen,
      // setShowGridLines,
      unFocusGrid: () => setFocusedGridId(null),
    },
    utils: {
      onLayoutChange,
      getfullWidgetDataFromPanelItem,
      itemLocationValid,
      onDragStart: (layouts: Layout[], itemPre: Layout, itemNow: Layout) => {
        setShowGridLines(true);

        if (panelState === PanelState.NORMAL) {
          // console.log('drag start', layouts, itemPre, itemNow);
          onFocusDragStart(layouts, itemPre, {
            clientX: itemNow.x,
            clientY: itemNow.y,
          });
        }
      },
      onDragging: (layouts: Layout[], itemPre: Layout, itemNow: Layout) => {
        if (panelState === PanelState.NORMAL) {
          onFocusDrag(layouts, itemPre, {
            clientX: itemNow.x,
            clientY: itemNow.y,
          });
          return;
        } else if (panelState === PanelState.FOCUSED) {
          // drag would unfocus the grid
          setFocusedGridId(null);
          return;
        } else if (panelState === PanelState.DRAG_AND_DROP) {
          // console.log('dragging', layouts, itemPre, itemNow);
          onCrossDragging({
            layoutWithDraggingItem: layouts,
            itemEntrySnapshot: itemPre,
            currentItemState: itemNow,
          });
          return;
        }
      },
      onDragStop: (layouts: Layout[], itemPre: Layout, itemNow: Layout) => {
        setShowGridLines(false);

        if (panelState === PanelState.NORMAL) {
          // console.log('drag end');
          onFocusDragEnd(layouts, itemPre, {
            clientX: itemNow.x,
            clientY: itemNow.y,
          });
        }
      },
      onDrop: (layouts: Layout[], item: Layout, e: Event) => {
        if (panelState === PanelState.DRAG_AND_DROP) {
          setisToolBoxOpen(false); // close toolbox when dropped
          onCrossDragEnd(); // Ensure reset dragging item before dropping.
          onCrossDrop({
            layoutWithDroppedItem: layouts,
            droppedItem: item,
            event: e,
          });
        }
      },
      onDragOver: (e: DragOverEvent) => {
        // console.log('drag over', draggingItem);
        return {
          w: draggingItem?.w || 1,
          h: draggingItem?.h || 1,
        };
      },
    },
  };
};
