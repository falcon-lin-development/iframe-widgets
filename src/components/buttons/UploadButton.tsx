import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Image from 'next/image';

// const UploadIcon = () => (
//   <Image
//     src="/icons/upload-image.svg"
//     alt="Upload Image"
//     width={15}
//     height={15}
//   ></Image>
// );

type Props = {
  onFileSelect: (file: File) => void;
  children: React.ReactNode;
};

const UploadButton: React.FC<Props> = ({ onFileSelect, children }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      onFileSelect(file); // Propagate the file to the parent component or context
    }
  };

  return (
    <label htmlFor="upload-button">
      <input
        style={{ display: 'none' }}
        id="upload-button"
        type="file"
        accept=".png, .jpg, .jpeg"
        onChange={handleFileChange}
      />
      <Button
        sx={{
          padding: '6px 10px',
          borderRadius: '4px',
        }}
        variant="text"
        component="span"
        // startIcon={<UploadIcon />}
      >
        {children || 'Upload'}
      </Button>
    </label>
  );
};

export default UploadButton;
