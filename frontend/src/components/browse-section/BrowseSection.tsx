import React from "react";
import { useState } from "react";
import "./BrowseSection.css";

const BrowseSection = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleBrowseClick: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (!event.target.files) {
      return;
    }
    const files = [];
    for (let i = 0; i < (event.target.files.length ?? 0); i++) {
      files.push(event.target.files[i]);
    }
    setSelectedFiles(files);
  };

  const handleSubmit = () => {
    // const emails = [];
    // selectedFiles.forEach((file) => {
    //   // process
    // });
  };

  return (
    <div className="BrowseSection">
      <label htmlFor="files" className="browse_button">
        Select Files
      </label>
      <input
        id="files"
        type="file"
        multiple
        accept={"text/txt"}
        onChange={handleBrowseClick}
        className="browse_files_input"
      />
      <ul>
        {selectedFiles.map((file, index) => (
          <li key={`${index}-${file.name}`}>{file.name}</li>
        ))}
      </ul>
      <button onClick={handleSubmit} className="browse_button">
        Send
      </button>
    </div>
  );
};

export default BrowseSection;
