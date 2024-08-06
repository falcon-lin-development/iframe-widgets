import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import { NextPage } from 'next';
import { Box } from '@mui/material';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface ToolBoxItemProps {
  item: Layout;
  onTakeItem: (item: Layout) => void;
}

const ToolBoxItem: React.FC<ToolBoxItemProps> = ({ item, onTakeItem }) => (
  <div className="toolbox__items__item" onClick={() => onTakeItem(item)}>
    {item.i}
  </div>
);

interface ToolBoxProps {
  items: Layout[];
  onTakeItem: (item: Layout) => void;
}

const ToolBox: React.FC<ToolBoxProps> = ({ items, onTakeItem }) => (
  <div className="toolbox">
    <span className="toolbox__title">Toolbox</span>
    <div className="toolbox__items">
      {items.map((item) => (
        <ToolBoxItem key={item.i} item={item} onTakeItem={onTakeItem} />
      ))}
    </div>
  </div>
);

interface ToolboxLayoutProps {
  className?: string;
  onLayoutChange?: (layout: Layout[], layouts: Layouts) => void;
  initialLayout?: Layout[];
}

const generateLayout = (): Layout[] => {
  return _.map(_.range(0, 25), (item, i) => {
    const y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05,
    };
  });
};

const ToolboxLayout: NextPage<ToolboxLayoutProps> = ({
  className = 'layout',
  initialLayout = generateLayout(),
}) => {
  const [state, setState] = useState({
    currentBreakpoint: 'lg',
    compactType: 'vertical' as 'vertical' | 'horizontal' | null,
    mounted: false,
    layouts: { lg: initialLayout } as Layouts,
    toolbox: { lg: [] as Layout[] } as { [key: string]: Layout[] },
  });

  useEffect(() => {
    setState((prevState) => ({ ...prevState, mounted: true }));
  }, []);

  const generateDOM = () => {
    return _.map(state.layouts[state.currentBreakpoint], (l) => (
      <div
        key={l.i}
        className={l.static ? 'static' : ''}
        style={{
          border: '1px solid black',
        }}
      >
        <Box onClick={() => onPutItem(l)}>&times;</Box>
        {l.static ? (
          <span
            className="text"
            title="This item is static and cannot be removed or resized."
          >
            Static - {l.i}
          </span>
        ) : (
          <span className="text">{l.i}</span>
        )}
      </div>
    ));
  };

  const onBreakpointChange = (breakpoint: string) => {
    setState((prevState) => ({
      ...prevState,
      currentBreakpoint: breakpoint,
      toolbox: {
        ...prevState.toolbox,
        [breakpoint]:
          prevState.toolbox[breakpoint] ||
          prevState.toolbox[prevState.currentBreakpoint] ||
          [],
      },
    }));
  };

  const onCompactTypeChange = () => {
    const { compactType: oldCompactType } = state;
    const compactType =
      oldCompactType === 'horizontal'
        ? 'vertical'
        : oldCompactType === 'vertical'
          ? null
          : 'horizontal';
    setState((prevState) => ({ ...prevState, compactType }));
  };

  const onTakeItem = (item: Layout) => {
    setState((prevState) => ({
      ...prevState,
      toolbox: {
        ...prevState.toolbox,
        [prevState.currentBreakpoint]: prevState.toolbox[
          prevState.currentBreakpoint
        ].filter(({ i }) => i !== item.i),
      },
      layouts: {
        ...prevState.layouts,
        [prevState.currentBreakpoint]: [
          ...prevState.layouts[prevState.currentBreakpoint],
          item,
        ],
      },
    }));
  };

  const onPutItem = (item: Layout) => {
    setState((prevState) => ({
      ...prevState,
      toolbox: {
        ...prevState.toolbox,
        [prevState.currentBreakpoint]: [
          ...(prevState.toolbox[prevState.currentBreakpoint] || []),
          item,
        ],
      },
      layouts: {
        ...prevState.layouts,
        [prevState.currentBreakpoint]: prevState.layouts[
          prevState.currentBreakpoint
        ].filter(({ i }) => i !== item.i),
      },
    }));
  };

  const onLayoutChange = (layout: Layout[], layouts: Layouts) => {
    setState((prevState) => ({ ...prevState, layouts }));
  };

  const onNewLayout = () => {
    setState((prevState) => ({
      ...prevState,
      layouts: { lg: generateLayout() },
    }));
  };

  return (
    <div>
      <div>
        Compaction type:{' '}
        {_.capitalize(state.compactType || '') || 'No Compaction'}
      </div>
      <button onClick={onNewLayout}>Generate New Layout</button>
      <button onClick={onCompactTypeChange}>Change Compaction Type</button>

      <ToolBox
        items={state.toolbox[state.currentBreakpoint] || []}
        onTakeItem={onTakeItem}
      />

      <ResponsiveReactGridLayout
        className={className}
        layouts={state.layouts}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={onLayoutChange}
        measureBeforeMount={false}
        useCSSTransforms={state.mounted}
        compactType={state.compactType}
        preventCollision={!state.compactType}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 6 }}
        rowHeight={30}
        containerPadding={[0, 0]}
        margin={[0, 0]}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default ToolboxLayout;
