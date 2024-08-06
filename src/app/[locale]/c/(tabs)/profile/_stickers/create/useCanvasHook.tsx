import React, { useRef, useState, useEffect, useMemo } from 'react';
import { fabric } from 'fabric';
import { TextField, Box, IconButton, Button } from '@mui/material';
import assets from '@/constants';
import { TEXTSTYLES, FONTFAMILIES } from './TextStyles';

const useCanvasHook = ({
  isReadyToRender,
  avatarSrc,
}: {
  isReadyToRender: boolean;
  avatarSrc: string;
}) => {
  const canvasSize = 360;
  const canvasRef = useRef(null);

  // handler
  const addTextField = () => {
    const canvas = (canvasRef.current as any).fabric;
    const text = new fabric.Textbox('caption...', {
      left: (canvasSize - 80) / 2,
      top: canvasSize - 50,
      textAlign: 'left',
      fontSize: 32,
      fontWeight: 'bold',
      height: 50,
      width: 80,
    });

    text.set({ ...FONTFAMILIES[0] });
    text.set({ ...TEXTSTYLES[0] });
    text.set('data', {
      textStyleId: 0,
      fontFamilyId: 0,
    });
    canvas.add(text);
    canvas.requestRenderAll();
  };

  const changeTextColor = (textbox: fabric.Textbox) => {
    const canvas = (canvasRef.current as any).fabric;
    const data = textbox.data;
    if (!data?.textStyleId) {
      textbox.set('data', {
        ...textbox.data,
        textStyleId: 0,
      });
    }
    const nextStyle =
      TEXTSTYLES[(textbox.data.textStyleId + 1) % TEXTSTYLES.length];
    textbox.set(nextStyle);
    textbox.set('data', {
      ...textbox.data,
      textStyleId: (textbox.data.textStyleId + 1) % TEXTSTYLES.length,
    });
    canvas.requestRenderAll();
  };

  const changeFontFamily = (textbox: fabric.Textbox) => {
    const canvas = (canvasRef.current as any).fabric;
    const data = textbox.data;
    if (!data?.fontFamilyId) {
      textbox.set('data', {
        ...textbox.data,
        fontFamilyId: 0,
      });
    }
    const nextStyle =
      FONTFAMILIES[(textbox.data.fontFamilyId + 1) % FONTFAMILIES.length];
    // console.log(
    //   "fontFamilyId: ", textbox.data.fontFamilyId,
    //   "| current:", FONTFAMILIES[textbox.data.fontFamilyId].fontFamily,
    //   "| next font: ", nextStyle.fontFamily,
    // );
    textbox.set(nextStyle);
    textbox.set('data', {
      ...textbox.data,
      fontFamilyId: (textbox.data.fontFamilyId + 1) % FONTFAMILIES.length,
    });
    canvas.requestRenderAll();
  };

  const deleteObject = ({
    obj,
    currentSelectedObject = false,
  }: {
    obj?: fabric.Object;
    currentSelectedObject?: boolean;
  }) => {
    const canvas = (canvasRef.current as any).fabric;
    let target;
    if (obj) {
      target = obj;
    } else if (currentSelectedObject) {
      target = canvas.getActiveObject();
    } else {
      return;
    }

    if (target) {
      if (target.type === 'activeSelection') {
        target.forEachObject((obj: any) => {
          canvas.remove(obj);
        });
        canvas.discardActiveObject(); // Deselect the group
        canvas.requestRenderAll(); // Update canvas
      } else {
        canvas.remove(target);
      }
    }
  };

  // // utils
  // /**
  //  * Exports the Fabric.js canvas to a PNG image.
  //  * @param canvas The Fabric.js canvas instance to export.
  //  */
  // const exportCanvasAsPNG = (): void => {
  //   const canvas = (canvasRef.current as any).fabric;
  //   if (!canvas) {
  //     console.error('Canvas reference is not provided or invalid.');
  //     return;
  //   }

  //   // Export the canvas to a data URL (PNG format by default)
  //   const dataURL = canvas.toDataURL({
  //     format: 'png',
  //     multiplier: 3, // Adjust for higher resolution; 1 is for the same size
  //   });

  //   // Create a temporary link element to trigger the download
  //   const link = document.createElement('a');
  //   link.href = dataURL;
  //   link.download = 'canvas-export.png'; // Set the download file name
  //   document.body.appendChild(link);
  //   link.click(); // Trigger the download
  //   document.body.removeChild(link); // Clean up
  // };

  // init Canvas
  useEffect(() => {
    if (!isReadyToRender) return;

    const handleKeyDown = (e: { key: string }) => {
      const canvas = (canvasRef.current as any).fabric;
      const activeObject = canvas.getActiveObject();
      // console.log("e.key", e.key, activeObject?.type, activeObject?.isEditing)

      if (canvas && activeObject) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          if (activeObject.type === 'textbox') {
            if (activeObject.isEditing) {
              console.log('isEditing, delete charactor only ');
              return;
            } else {
              deleteObject({ obj: activeObject });
            }
          } else {
            deleteObject({ obj: activeObject });
          }
        }
      }
    };

    if (canvasRef.current && !(canvasRef.current as any).fabric) {
      // Initialize fabric.Canvas only once and store it in the ref
      const fabricCanvas = new fabric.Canvas(canvasRef.current);
      (canvasRef.current as any).fabric = fabricCanvas;
      // Now canvasRef.current.fabric holds the fabric.Canvas instance
      fabricCanvas.on('object:scaling', function (e) {
        const obj = e.target;
        if (!obj || !(obj.type === 'textbox')) return;

        // Maintain aspect ratio
        if (obj.scaleX !== obj.scaleY) {
          const uniformScale = obj.scaleY;
          obj.scaleX = uniformScale;
          obj.scaleY = uniformScale;
        }
      });

      fabricCanvas.on('object:scaling', function (e) {
        const obj = e.target as fabric.Object;
        if (
          !obj ||
          !obj.width ||
          !obj.height ||
          !obj.scaleX ||
          !obj.scaleY ||
          !(obj.type === 'textbox')
        )
          return;
        // Define min and max dimensions
        const minWidth = 50;
        const minHeight = 30;
        const maxWidth = 300;
        const maxHeight = 150;

        if (obj.width * obj.scaleX < minWidth) {
          obj.scaleX = minWidth / obj.width;
        } else if (obj.width * obj.scaleX > maxWidth) {
          obj.scaleX = maxWidth / obj.width;
        }

        if (obj.height * obj.scaleY < minHeight) {
          obj.scaleY = minHeight / obj.height;
        } else if (obj.height * obj.scaleY > maxHeight) {
          obj.scaleY = maxHeight / obj.height;
        }
      });

      addTextField();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isReadyToRender]); // Ensure this effect is properly dependent on your canvas instance

  useEffect(() => {
    if (!isReadyToRender) return;
    const canvas = (canvasRef.current as any).fabric;
    const src = avatarSrc
      ? avatarSrc + '?time=' + new Date().getTime()
      : assets.images.app.defaultAvatar;
    fabric.Image.fromURL(
      src,
      (img) => {
        img.scaleToWidth(canvasSize);
        img.scaleToHeight(canvasSize);
        img.selectable = false;
        canvas.add(img);
        img.sendToBack();
        canvas.requestRenderAll();
      },
      {
        crossOrigin: 'anonymous',
      },
    );
  }, [avatarSrc, isReadyToRender]);

  return {
    canvasSize,
    canvasRef,
    avatarSrc,
    unfocusAll: () => {
      console.log('unfocusAll');
      const canvas = (canvasRef.current as any).fabric;
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    },
    addTextField,
    changeSelectedTextColor: () => {
      const canvas = (canvasRef.current as any).fabric;
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'textbox') {
        changeTextColor(activeObject);
      } else if (activeObject && activeObject.type === 'activeSelection') {
        activeObject.forEachObject((obj: any) => {
          if (obj.type === 'textbox') {
            changeTextColor(obj);
          }
        });
      }
    },
    changeSelectedFontFamily: () => {
      const canvas = (canvasRef.current as any).fabric;
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'textbox') {
        changeFontFamily(activeObject);
      } else if (activeObject && activeObject.type === 'activeSelection') {
        activeObject.forEachObject((obj: any) => {
          if (obj.type === 'textbox') {
            changeFontFamily(obj);
          }
        });
      }
    },
    deleteSelectedObject: () => {
      deleteObject({ currentSelectedObject: true });
    },
    // exportCanvasAsPNG,
  };
};

export default useCanvasHook;
