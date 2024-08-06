'use client';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const useReadFile = (filePath: string) => {
  const [fileContent, setFileContent] = useState<Record<string, any> | null>(
    null,
  );
  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(filePath);
        setFileContent(response.data);
      } catch (error) {
        console.error('Error reading file', error);
      }
    };
    fetchFile();
  }, [filePath]);

  const ready = useMemo(() => {
    return fileContent != null && Object.keys(fileContent).length > 0;
  }, [fileContent]);
  return { fileContent, ready };
};

export default useReadFile;
