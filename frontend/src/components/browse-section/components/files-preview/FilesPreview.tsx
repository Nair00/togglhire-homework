import React from "react";
import { FileState } from "src/types";

interface FilesPreviewProps {
  files: FileState[];
}

const FilesPreview: React.FC<FilesPreviewProps> = () => {
  return <div>FilesPreview</div>;
};

export default FilesPreview;
