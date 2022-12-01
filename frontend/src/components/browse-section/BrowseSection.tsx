import React, { useCallback } from "react";
import { useState } from "react";
import "./BrowseSection.css";

const BrowseSection = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleBrowseClick: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        if (!event.target.files) {
          return;
        }
        const files = [];
        for (let i = 0; i < (event.target.files.length ?? 0); i++) {
          files.push(event.target.files[i]);
        }
        setSelectedFiles(files);
      },
      [setSelectedFiles]
    );

  const handleSubmit = useCallback(() => {
    const emails: string[] = [];
    selectedFiles.forEach((file) => {
      file.text().then((data) => {
        data.split(/\r?\n/).forEach((line) => {
          line.trim().length > 0 && emails.push(line);
        });
      });
    });
    // Send to be
    console.log(emails);
  }, [selectedFiles]);

  const renderSelectedFiles = useCallback(() => {
    return (
      <ul>
        {selectedFiles.map((file, index) => (
          <li key={`${index}-${file.name}`}>{file.name}</li>
        ))}
      </ul>
    );
  }, [selectedFiles]);

  return (
    <div className="BrowseSection">
      <label htmlFor="files" className="browse_button">
        {"Select Files"}
      </label>
      <input
        id="files"
        type="file"
        multiple
        accept={"text/txt"}
        onChange={handleBrowseClick}
        className="browse_files_input"
      />
      {renderSelectedFiles()}
      <button onClick={handleSubmit} className="browse_button">
        {"Send"}
      </button>
    </div>
  );
};

export default BrowseSection;
