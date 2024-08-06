'use client';

import { useEffect, useMemo, useState } from 'react';

export const TEXTSTYLES = [
  {
    fill: 'black',
    stroke: 'white',
    strokeWidth: 1,
  },
  {
    fill: 'white',
    stroke: 'black',
    strokeWidth: 1,
  },
  {
    fill: 'red',
    stroke: 'black',
    strokeWidth: 1,
  },
  {
    fill: 'black',
    stroke: 'red',
    strokeWidth: 1,
  },
  {
    fill: 'blue',
    stroke: 'white',
    strokeWidth: 1,

    // "backgroundColor": "grey"
  },
  {
    fill: 'green',
    stroke: 'orange',
    strokeWidth: 1,

    // "backgroundColor": "lightblue"
  },
  {
    fill: 'purple',
    stroke: 'lime',
    strokeWidth: 1,

    // "backgroundColor": "pink"
  },
];

export const FONTFAMILIES = [
  {
    fontFamily: 'Times New Roman',
  },
  {
    fontFamily: 'Neue Metana',
  },

  {
    fontFamily: 'Arial',
  },
  {
    fontFamily: 'Helvetica',
  },
  {
    fontFamily: 'Courier New',
  },
  {
    fontFamily: 'Verdana',
  },
  {
    fontFamily: 'Georgia',
  },
  {
    fontFamily: 'Palatino',
  },

  {
    fontFamily: 'Comic Sans MS',
  },
  {
    fontFamily: 'Trebuchet MS',
  },

  {
    fontFamily: 'Impact',
  },
];
// const useTextStyle = ({ textbox }: { textbox: fabric.Textbox }) => {
//     const [textStyleId, setTextStyleId] = useState(0);
//     const currentTextStyle = useMemo(() => TEXTSTYLES[textStyleId], [textStyleId]);

//     const changeTextStyle = () => {
//         // set textStyle
//         const textStyle = TEXTSTYLES[(textStyleId + 1) % TEXTSTYLES.length];
//         textbox.set(textStyle);

//         // set States
//         setTextStyleId((textStyleId + 1) % TEXTSTYLES.length);
//         textbox.set("data", {
//             ...textbox.data,
//             textStyleId
//         });
//     }

//     // read textbox data
//     useEffect(() => {
//         const data = textbox.data;
//         if (data) {
//             setTextStyleId(data.textStyleId);
//         }
//     }, [textbox]);

//     return {
//         currentTextStyle,
//         changeTextStyle,
//     }
// }

// export default useTextStyle;
