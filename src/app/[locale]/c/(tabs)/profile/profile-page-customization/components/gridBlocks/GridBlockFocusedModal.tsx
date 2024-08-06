/**
 * Grid Focused Modal
 *
 */

import {
  Modal,
  Popover,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  List,
} from '@mui/material';
import { EditIcon, ArchiveIcon, DeleteIcon } from 'lucide-react';
import { isMobile } from 'react-device-detect';
import colors from '@/styles/colors.config';

export const GridBlockFocusedModal: React.FC<{
  focused: boolean;
  gridRef: React.RefObject<HTMLDivElement>;
  handleClose: () => void;
  id: string;
  content?: React.ReactNode;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}> = ({
  focused,
  gridRef,
  handleClose,
  id,
  content,
  onEdit,
  onArchive,
  onDelete,
}) => {
  return (
    <Modal
      open={focused}
      sx={{
        // add blur to what underneath
        backdropFilter: 'blur(4px)',
      }}
    >
      <>
        <Popover
          id={id}
          open={focused}
          anchorEl={gridRef.current}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          sx={{
            zIndex: 1400,
            marginLeft: isMobile ? '0px' : '10px',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <List
            sx={{
              padding: 0,
            }}
          >
            <ListItemButton
              onClick={() => {
                onEdit();
                handleClose();
              }}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </ListItemButton>
            <Divider />
            <ListItemButton
              onClick={() => {
                onArchive();
                handleClose();
              }}
            >
              <ListItemIcon>
                <ArchiveIcon />
              </ListItemIcon>
              <ListItemText primary="Archive" />
            </ListItemButton>
            <Divider />
            <ListItemButton
              onClick={() => {
                onDelete();
                handleClose();
              }}
              sx={{
                color: colors.accentError,
              }}
            >
              <ListItemIcon>
                <DeleteIcon color={colors.accentError} />
              </ListItemIcon>
              <ListItemText primary="Delete" />
            </ListItemButton>
          </List>
        </Popover>
      </>
    </Modal>
  );
};
