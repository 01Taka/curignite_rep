import React from 'react';

interface FilePreviewProps {
  urls: string[];
}

const FilePreview: React.FC<FilePreviewProps> = ({ urls }) => {
  return (
    <div>
      {urls.map((url, index) => (
        <img key={index} src={url} alt={`preview-${index}`} />
      ))}
    </div>
  )
};

export default FilePreview;
