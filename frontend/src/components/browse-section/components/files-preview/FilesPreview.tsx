import React from "react";
import { FileState } from "src/types";
import "./FilesPreview.css";

interface FilesPreviewProps {
  /**
   * Array containing the states of each file (name and loadingState)
   */
  files: FileState[];
  /**
   * Action when an item is clicked
   */
  onItemClick?: (index: number) => void;
}

const FilesPreview: React.FC<FilesPreviewProps> = ({ files, onItemClick }) => {
  const renderListItem = (file: FileState, index: number) => {
    const onClick = () => {
      onItemClick?.(index);
    };
    return (
      <li
        key={`${file.name}-${index}`}
        className={"files_preview_item"}
        id={file.state}
        onClick={onClick}
      >
        {`${file.name}`}
      </li>
    );
  };

  return <ul className="files_preview_list">{files.map(renderListItem)}</ul>;
};

export default FilesPreview;
