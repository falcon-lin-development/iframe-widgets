'use client';
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Responsive,
  WidthProvider,
  Layouts,
  Layout,
  ResponsiveProps,
} from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import DraggableElement from './_DraggableElement';
import Script from 'next/script';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface DragFromOutsideLayoutProps extends ResponsiveProps {
  onLayoutChange?: (layout: Layout[], layouts: Layouts) => void;
}

const DragFromOutsideLayout: React.FC<DragFromOutsideLayoutProps> = (props) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [compactType, setCompactType] = useState<
    'horizontal' | 'vertical' | null
  >('vertical');
  const [mounted, setMounted] = useState(false);
  const [layouts, setLayouts] = useState<Layouts>({ lg: generateLayout() });

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateDOM = () => {
    return _.map(layouts.lg, (l, i) => {
      return (
        <div
          key={i}
          className={l.static ? 'static' : ''}
          style={{
            border: '1px solid black',
          }}
        >
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  };

  const onBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
  };

  const onCompactTypeChange = () => {
    setCompactType((prevCompactType) =>
      prevCompactType === 'horizontal'
        ? 'vertical'
        : prevCompactType === 'vertical'
          ? null
          : 'horizontal',
    );
  };

  const onLayoutChange = (layout: Layout[], allLayouts: Layouts) => {
    console.log(layout, allLayouts);
    if (props.onLayoutChange) {
      props.onLayoutChange(layout, allLayouts);
    }
    /**
     * remove all items that are still dropping
     */
    setLayouts({
      lg: allLayouts.lg.filter(
        (item) => item.i !== '__dropping-elem__',
      ) as Layout[],
    });
  };

  const onNewLayout = () => {
    setLayouts({ lg: generateLayout() });
  };

  const onDrop = (layout: Layout[], layoutItem: Layout, _event: Event) => {
    alert(
      `Dropped element props:\n${JSON.stringify(layoutItem, ['x', 'y', 'w', 'h'], 2)}`,
    );
  };

  const handleDragStart = (e: React.DragEvent | React.TouchEvent) => {
    if ((e as React.TouchEvent).touches) {
      // e.dataTransfer?.setData("text/plain", "");
    } else {
      // e.dataTransfer.setData("text/plain", "");
    }
  };

  const handleDrop = (layout: Layout[], item: Layout, e: Event) => {
    console.log('Dropped', layout, item, e);
    // Handle the drop here
  };

  return (
    <div>
      {/* <script src="drag-drop-touch.esm.min.js?autoload" type="module"></script> */}
      <Script
        src="https://drag-drop-touch-js.github.io/dragdroptouch/dist/drag-drop-touch.esm.min.js"
        strategy="beforeInteractive"
        type="module"
      />
      <div>
        Current Breakpoint: {currentBreakpoint} (
        {props.cols ? props.cols[currentBreakpoint] : 0} columns)
      </div>
      <div>Compaction type: {compactType || 'No Compaction'}</div>
      <button onClick={onNewLayout}>Generate New Layout</button>
      <button onClick={onCompactTypeChange}>Change Compaction Type</button>
      <div
        className="droppable-element"
        draggable={true}
        unselectable="on"
        onDragStart={(e) => e.dataTransfer.setData('text/plain', '')}
      >
        Droppable Element (Drag me!)
      </div>
      {/* <DraggableElement onDrop={handleDrop} /> */}
      <ResponsiveReactGridLayout
        {...props}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 6 }}
        rowHeight={20}
        containerPadding={[0, 0]}
        margin={[0, 0]}
        layouts={layouts}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={onLayoutChange}
        onDrop={handleDrop}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        compactType={compactType}
        preventCollision={!compactType}
        isDroppable={true}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default DragFromOutsideLayout;

function generateLayout(): Layout[] {
  return _.map(_.range(0, 5), function (item, i) {
    const y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: Math.round(Math.random() * 5) * 2,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05,
    };
  });
}
