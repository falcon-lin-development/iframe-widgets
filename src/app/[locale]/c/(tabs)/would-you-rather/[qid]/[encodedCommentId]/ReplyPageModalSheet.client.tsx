'use client';
import Sheet from 'react-modal-sheet';

import ReplyPage from './page';
import React from 'react';

const ReplyPageModalSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  encodedCommentId: string;
}> = ({ isOpen, onClose, encodedCommentId }) => {
  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container
        style={{
          overflowY: 'auto',
        }}
        // className='tw-max-w-mobile'
      >
        <ReplyPage
          params={{
            locale: 'en',
            qid: '1234',
            encodedCommentId: encodedCommentId,
            onClose: onClose,
          }}
        />
      </Sheet.Container>
      <Sheet.Backdrop
        onTap={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
    </Sheet>
  );
};

export default ReplyPageModalSheet;
