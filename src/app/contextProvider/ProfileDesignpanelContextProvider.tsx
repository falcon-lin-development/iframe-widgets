'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import {
  BaseProfileWidgetType,
  ItemLayoutZIndex,
  ProfileWidgetTypes,
} from '../widgets/ProfileWidgetTypes';
import assets from '@/constants';

// hooks
import { useCommunityId } from '@/hooks/useCommunity';
import useCommunityProfile from '@/hooks/useCommunityProfile';
import { Community } from '@/data/services/fetchCommunityService';

// component
import SuperellipseClipPath from './SuperellipseClipPath';
import { useProfileGridViewCustomisation } from '@/data/graphql/hooks/profileGridViewCustomisation/useProfileGridViewCustomisation';
// import { usePreviewCommunityProfileWidgetDraft } from '@/data/graphql/hooks/profileGridViewCustomisation/usePreviewCommunityProfileWidgetDraft';

export interface PanelItem extends Layout {}

const _useCommunityUserInfo = () => {
  const { communityId } = useCommunityId;

  const { communityProfile, isProfileInit } = useCommunityProfile({
    community_id: communityId,
  } as Community);

  return {
    isProfileInit,
    communityProfile,
  };
};

const _useDesignPanel = () => {
  /**
   * @dev fetch from draft
   */
  const DROPPING_ITEM_ID = '__dropping-elem__';
  const MAX_COL = 6;
  const MAX_ROW = 11;

  const communityUserInfo = _useCommunityUserInfo();

  const [draggingItem, setDraggingItem] = useState<PanelItem | null>(null);
  const [draggingItemInfo, setDraggingItemInfo] = useState<PanelItem | null>(
    null,
  );
  const [cachePanel, setCachePanel] = useState<PanelItem[]>([
    // { i: 'block1', x: 0, y: 0, w: 6, h: 6 },
    // { i: 'block2', x: 0, y: 6, w: 6, h: 1 },
  ]);
  const [designPanel, setDesignPanel] = useState<PanelItem[]>([
    // { i: 'block4', x: 0, y: 0, w: 6, h: 1 },
    // { i: 'block5', x: 0, y: 9, w: 1, h: 1 },
    // { i: 'block3', x: 0, y: 7, w: 2, h: 1 },
    {
      i: ProfileWidgetTypes.MootiezBrandingWidget,
      x: 1,
      y: 10,
      w: 4,
      h: 1,
      static: true,
    },
  ]);
  const [widgetsData, setWidgestData] = useState<{
    [key: string]: Omit<BaseProfileWidgetType, 'layout'>;
  }>({
    [`${ProfileWidgetTypes.MootiezBrandingWidget}`]: {
      id: ProfileWidgetTypes.MootiezBrandingWidget,
      type: ProfileWidgetTypes.MootiezBrandingWidget,
      attributes: {
        style_classes: [],
      },
    },
  });
  const {
    communityProfileWidgetDraft: {
      state: { communityProfileWidgetDraft, communityProfileWidgetDraftInit },
      actions: { refreshCommunityProfileWidgetDraft },
    },
    updateCommunityProfileWidgetDraft: {
      state: { updateCommunityProfileWidgetDraftState },
      actions: { updateCommunityProfileWidgetDraft },
    },
    revertCommunityProfileWidgetDraft: {
      state: { revertCommunityProfileWidgetDraftState },
      actions: { revertCommunityProfileWidgetDraft },
    },
    publishCommunityProfileWidget: {
      state: { publishCommunityProfileWidgetState },
      actions: { publishCommunityProfileWidget },
    },
  } = useProfileGridViewCustomisation();
  const [autoSaveTimer, setAutoSaveTimer] = useState<any | null>(null);

  /**
   * Helper functions / states
   *
   */
  const isDraftInit = useMemo(() => {
    return Boolean(communityProfileWidgetDraftInit);
  }, [communityProfileWidgetDraftInit]);

  const _itemLocationValid = (item: PanelItem) => {
    if (item.x + item.w > MAX_COL || item.y + item.h > MAX_ROW) {
      return false;
    }
    return true;
  };

  const isDraggingItemDroppable = useMemo(() => {
    const _setDroppableCss = (isDroppable: boolean) => {
      const element = document.querySelector(
        '.react-grid-item.react-grid-placeholder',
      );
      if (element) {
        if (isDroppable) {
          element.classList.remove('not-droppable');
          // element.classList.add('droppable');
        } else {
          // element.classList.remove('droppable');
          element.classList.add('not-droppable');
        }
      }
    };

    /**
     * MAIN Logic
     */
    if (!draggingItem || !draggingItemInfo) return null;
    /**
     * if dragging item x, y , w, h is not fittable to the design panel layout
     * which is 11rows * 6cols
     */
    const isDroppable = _itemLocationValid(draggingItemInfo);
    _setDroppableCss(isDroppable);
    return isDroppable;
  }, [draggingItem, draggingItemInfo]);

  const widgetToPanels = (widgets: Record<string, BaseProfileWidgetType>) => {
    // for widget.layout.z > 0 , goes to designPanel
    // for widget.layout.z < 0 , goes to cachePanel
    // for widget.layout.z = 0 , ignore for now

    const _widgetsData = Object.entries(widgets).reduce(
      (
        acc: Record<string, Omit<BaseProfileWidgetType, 'layout'>>,
        [key, widget]: [string, BaseProfileWidgetType],
      ) => {
        acc[widget.id] = {
          id: widget.id,
          type: widget.type,
          attributes: widget.attributes,
        };
        return acc;
      },
      {},
    );

    const _designPanel: PanelItem[] = [];
    const _cachePanel: PanelItem[] = [];
    Object.keys(widgets).forEach((key) => {
      const widget = widgets[key];
      if (widget.layout.z > 0) {
        _designPanel.push({
          i: key,
          x: widget.layout.x,
          y: widget.layout.y,
          w: widget.layout.w,
          h: widget.layout.h,
          static: widget.layout.z === ItemLayoutZIndex.static,
        });
      } else if (widget.layout.z < 0) {
        _cachePanel.push({
          i: key,
          x: widget.layout.x,
          y: widget.layout.y,
          w: widget.layout.w,
          h: widget.layout.h,
        });
      }
    });

    return {
      designPanel: _designPanel,
      cachePanel: _cachePanel,
      widgetsData: _widgetsData,
    };
  };

  const panelsToWidgets = (
    designPanel: PanelItem[],
    cachePanel: PanelItem[],
    widgetsData: Record<string, Omit<BaseProfileWidgetType, 'layout'>>,
  ) => {
    // return the widgets data
    const _widgets: Record<string, BaseProfileWidgetType> = {};
    designPanel.forEach((item) => {
      const widgetData = widgetsData[item.i];
      if (widgetData) {
        _widgets[item.i] = {
          id: widgetData.id,
          type: widgetData.type,
          layout: {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            z: item.static ? ItemLayoutZIndex.static : ItemLayoutZIndex.content,
          },
          attributes: widgetData.attributes,
        };
      }
    });
    cachePanel.forEach((item) => {
      const widgetData = widgetsData[item.i];
      if (widgetData) {
        _widgets[item.i] = {
          id: widgetData.id,
          type: widgetData.type,
          layout: {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            z: ItemLayoutZIndex.archived,
          },
          attributes: widgetData.attributes,
        };
      }
    });

    return _widgets;
  };

  /**
   * Hooks
   */
  useEffect(() => {
    // init setup panels
    if (isDraftInit) {
      if (communityProfileWidgetDraft) {
        const { widget: widgets, page_config: pageConfig } =
          communityProfileWidgetDraft.data;
        const { designPanel, cachePanel, widgetsData } =
          widgetToPanels(widgets);
        setWidgestData(widgetsData);
        setDesignPanel(designPanel);
        setCachePanel(cachePanel);
      } else {
        console.error(
          'communityProfileWidgetDraft is not available',
          communityProfileWidgetDraft,
        );
      }
    }
  }, [
    isDraftInit, // only trigger when draft is first init
    //  communityProfileWidgetDraft
  ]);

  useEffect(() => {
    console.log({ data: 'data', designPanel, widgetsData });
  }, [designPanel, widgetsData]);

  useEffect(() => {
    // for any changes in designPanel, cachePanel, widgetsData
    // start a timer to auto save
    // if new changes are made, reset the timer
    if (!isDraftInit) return;
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // start a new timer for 5 seconds
    // console.log('set new timer');
    const _autoSaveTimer = setTimeout(() => {
      const widgets = panelsToWidgets(designPanel, cachePanel, widgetsData);

      updateCommunityProfileWidgetDraft({
        widgets: widgets,
        pageConfig: { ...communityProfileWidgetDraft?.data.page_config },
      });
      setAutoSaveTimer(null);
    }, 3500);
    setAutoSaveTimer(_autoSaveTimer);

    return () => {
      clearTimeout(autoSaveTimer);
    };
  }, [cachePanel, designPanel, widgetsData]);

  return {
    const: {
      MAX_COL,
      MAX_ROW,
    },
    state: {
      isDraftInit,

      updateCommunityProfileWidgetDraftState,
      communityUserInfo,
      designPanel,
      widgetsData,
      cachePanel,
    },
    actions: {
      setDesignPanel,
      setCachePanel,
      setWidgestData,
      saveToDraft: () => {
        const widgets = panelsToWidgets(designPanel, cachePanel, widgetsData);
        updateCommunityProfileWidgetDraft({
          widgets: widgets,
          pageConfig: { ...communityProfileWidgetDraft?.data.page_config },
        });
      },
      discardDraft: () => {
        revertCommunityProfileWidgetDraft().then((res) => {
          if (res.data?.revertCommunityProfileWidgetDraft.message === 'ok') {
            window.location.reload(); // refresh to reset everything
          }
        });
      },
      // preview: () => {},
      publish: () => {
        0;
        publishCommunityProfileWidget().then((res) => {
          if (res.data?.publishCommunityProfileWidget.message === 'ok') {
            window.location.reload(); // refresh to reset everything
          }
        });
      },
    },
    utils: {
      getfullWidgetDataFromPanelItem: ({
        item,
        fromPanel,
      }: {
        item: PanelItem;
        fromPanel: 'design' | 'cache';
      }): BaseProfileWidgetType => {
        const _widgetData: Omit<BaseProfileWidgetType, 'layout'> =
          widgetsData[item.i];
        const z =
          fromPanel === 'design'
            ? item.static
              ? ItemLayoutZIndex.static
              : ItemLayoutZIndex.content
            : ItemLayoutZIndex.archived;
        const fullWidgetData: BaseProfileWidgetType = {
          id: _widgetData.id,
          type: _widgetData.type,
          layout: {
            ...item,
            z,
          },
          attributes: _widgetData.attributes,
        };

        return fullWidgetData;
      },
      itemLocationValid: _itemLocationValid,
      onLayoutChange: (
        currentLayout: Layout[],
        //  allLayouts: Layouts,
      ) => {
        // ignore dropping item
        const _currentLayout = currentLayout.filter(
          (item) => item.i !== DROPPING_ITEM_ID,
        );
        setDesignPanel(_currentLayout);
      },
    },
    dragAndDrop: {
      desktop: {
        DROPPING_ITEM_ID,
        draggingItem,
        isDraggingItemDroppable,

        // drag item call
        onCrossDragStart: (item: PanelItem) => {
          setDraggingItem(item);
        },
        // panel call
        onCrossDragging: ({
          layoutWithDraggingItem,
          itemEntrySnapshot,
          currentItemState,
        }: {
          layoutWithDraggingItem: Layout[]; // i=__dropping-elem__
          itemEntrySnapshot: Layout; // i=__dropping-elem__
          currentItemState: Layout; // i=__dropping-elem__
        }) => {
          // w,h,x,y, i=__dropping-elem__
          setDraggingItemInfo(currentItemState);
        },
        // drag item call
        onCrossDragEnd: () => {
          setDraggingItem(null);
          setDraggingItemInfo(null);
        },
        onCrossDrop: ({
          layoutWithDroppedItem,
          droppedItem,
          event,
        }: {
          layoutWithDroppedItem: Layout[]; // i=__dropping-elem__
          droppedItem: Layout; // i=__dropping-elem__
          event: Event;
        }) => {
          console.log({
            state: 'onCrossDrop',
            layoutWithDroppedItem,
            droppedItem,
            event,
            draggingItemInfo,
            draggingItem,
          });
          if (!isDraggingItemDroppable) return; // if not valid location
          if (!draggingItemInfo || !draggingItem) return; // if no valid info

          const newItem: PanelItem = {
            i: draggingItem.i,
            w: draggingItemInfo.w,
            h: draggingItemInfo.h,
            x: draggingItemInfo.x,
            y: draggingItemInfo.y,
          };
          setDesignPanel((prevState) => {
            // ignore original item with same id
            const newState = prevState.filter((item) => item.i !== newItem.i);
            const nextState = [...newState, newItem]; // add new item to the layout
            return nextState;
          });
          setCachePanel((prevState) => {
            // ignore original item with same id
            const newState = prevState.filter((item) => item.i !== newItem.i);
            return [...newState];
          });
        },
      },
      mobile: {
        onDnDClick: (item: PanelItem) => {
          setDesignPanel((prevState) => {
            const _tempPreState = prevState.filter(
              (layout) => layout.i !== item.i,
            );
            return [..._tempPreState, item];
          });
          setCachePanel((prevState) => {
            return prevState.filter((layout) => layout.i !== item.i);
          });
        },
      },
      onArchive: (item: PanelItem) => {
        setDesignPanel((prevState) => {
          return prevState.filter((layout) => layout.i !== item.i);
        });
        setCachePanel((prevState) => {
          return [...prevState, { ...item, y: 0, x: 0 }];
        });
      },
    },
  };
};

export const ProfileDesignpanelContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const value = _useDesignPanel();

  return (
    <designPanelContext.Provider value={value}>
      <SuperellipseClipPath />
      {children}
    </designPanelContext.Provider>
  );
};

const designPanelContext = React.createContext<ReturnType<
  typeof _useDesignPanel
> | null>(null);
export const useProfileDesignPanel = () => {
  const context = React.useContext(designPanelContext);
  if (!context) {
    throw new Error(
      'useDesignPanel must be used within a DesignPanelContextProvider',
    );
  }
  return context;
};
