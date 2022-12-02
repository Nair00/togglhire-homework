import React, { useCallback, useRef } from "react";
import { useState } from "react";
import { postSend } from "../../api/Api";
import "./BrowseSection.css";
import { Button } from "./components/button/Button";
import { useFileReader } from "./hooks/useFileReader";

interface BrowseSectionProps {}

const BrowseSection: React.FC<BrowseSectionProps> = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { readFiles } = useFileReader({});

  const loadEmails = useCallback(
    (files: File[]) => {
      const newEmails: string[] = [];

      readFiles(files)
        .then((response) => {
          response.forEach((data) => {
            data.split(/\r?\n/).forEach((line) => {
              line.trim().length > 0 && newEmails.push(line);
            });
          });
          setEmails(newEmails);
        })
        .catch(() => {
          console.log("There was a problem while reading the files!");
        })
        .finally(() => {
          setIsDisabled(false);
        });
    },
    [setIsDisabled, readFiles, setEmails]
  );

  const handleBrowseClick: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        if (!event.target.files) {
          return;
        }
        setIsDisabled(true);
        const files = [];
        for (let i = 0; i < (event.target.files.length ?? 0); i++) {
          files.push(event.target.files[i]);
        }
        loadEmails(files);
      },
      [loadEmails]
    );

  const handleSubmit = useCallback(() => {
    postSend(emails)
      .then(async (r: Response) => {
        const isJson = r.headers
          .get("content-type")
          ?.includes("application/json");
        if (isJson) {
          r.json().then((data) => {
            console.log("S", data);
          });
        } else {
          console.log("error", r);
        }
      })
      .catch((e: any) => {
        console.log("E", e);
      });
  }, [emails]);

  return (
    <div className="BrowseSection">
      <Button
        onClick={() => {
          inputRef.current?.click();
        }}
        isDisabled={isDisabled}
        title={"Select Files"}
      />
      <input
        ref={inputRef}
        id="files"
        type="file"
        multiple
        accept={"text/txt"}
        onChange={handleBrowseClick}
        className="browse_files_input"
        disabled={isDisabled}
      />
      <Button onClick={handleSubmit} isDisabled={true} title={"Send"} />
    </div>
  );
};

export default BrowseSection;
