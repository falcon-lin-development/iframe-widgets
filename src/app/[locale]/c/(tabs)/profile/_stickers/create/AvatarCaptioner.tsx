import React, { useRef, useState, useEffect } from 'react';
import { TextField, Box, IconButton, Button } from '@mui/material';
import { PencilLine, Trash2, Brush, Type } from 'lucide-react';
import colors from '@/styles/colors.config';
import useCanvasHook from './useCanvasHook';

type AvatarCaptionerProps = {
  // avatarSrc: string;
  canvasHook: ReturnType<typeof useCanvasHook>;
};

const AvatarCaptioner: React.FC<AvatarCaptionerProps> = ({ canvasHook }) => {
  const {
    canvasSize,
    canvasRef,
    unfocusAll,
    addTextField,
    changeSelectedTextColor,
    changeSelectedFontFamily,
    deleteSelectedObject,
  } = canvasHook;

  return (
    <>
      <Box sx={{ paddingTop: '2rem' }} onClick={unfocusAll} />
      <Box position="relative" width={canvasSize} height={canvasSize}>
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize} />
      </Box>
      <Box sx={{ paddingTop: '2rem' }} onClick={unfocusAll} />
      <Box
        id="tool-box"
        sx={{
          display: 'flex',
          justifyContent: 'space-evenly',
          width: canvasSize,
        }}
        onClick={unfocusAll}
      >
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            addTextField();
          }}
          sx={{
            backgroundColor: colors.primary,
            '&:hover': {
              backgroundColor: colors.primary,
            },
          }}
        >
          <PencilLine size={24} color={colors.white} />
        </IconButton>
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            changeSelectedTextColor();
          }}
          sx={{
            backgroundColor: colors.primary,
            '&:hover': {
              backgroundColor: colors.primary,
            },
          }}
        >
          <Brush size={24} color={colors.white} />
        </IconButton>
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            changeSelectedFontFamily();
          }}
          sx={{
            backgroundColor: colors.primary,
            '&:hover': {
              backgroundColor: colors.primary,
            },
          }}
        >
          <Type size={24} color={colors.white} />
        </IconButton>

        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            deleteSelectedObject();
          }}
          sx={{
            backgroundColor: colors.primary,
            '&:hover': {
              backgroundColor: colors.primary,
            },
          }}
        >
          <Trash2 size={24} color={colors.white} />
        </IconButton>
      </Box>
    </>
  );
};

export default AvatarCaptioner;
