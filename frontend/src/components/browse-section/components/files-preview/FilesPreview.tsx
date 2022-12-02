import React from "react";
import { FileState } from "src/types";
import "./FilesPreview.css";

interface FilesPreviewProps {
  files: FileState[];
}

const FilesPreview: React.FC<FilesPreviewProps> = ({ files }) => {
  const renderListItem = (file: FileState, index: number) => {
    const state =
      file.state === "success" ? "✅" : file.state === "failed" ? "❌" : "";

    return (
      <li key={`${file.name}-${index}`} className={"files_preview_item"}>
        {`${file.name} ${state}`}
      </li>
    );
  };

  return <ul className="files_preview_list">{files.map(renderListItem)}</ul>;
};

export default FilesPreview;
