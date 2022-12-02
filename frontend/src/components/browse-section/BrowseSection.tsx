import React, { useCallback, useRef } from "react";
import { useState } from "react";
import { Button } from "./components/button/Button";
import { useFileReader } from "./hooks/useFileReader";
import FilesPreview from "./components/files-preview/FilesPreview";
import { FileState } from "src/types";
import "./BrowseSection.css";
import { postSendEmails } from "src/api";

interface BrowseSectionProps {}

const BrowseSection: React.FC<BrowseSectionProps> = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const candidatesEmails = useRef<string[]>([]);

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
          candidatesEmails.current.push(...newEmails);
        })
        .catch(() => {
          console.log("There was a problem while reading the files!");
        })
        .finally(() => {
          setIsDisabled(false);
        });
    },
    [readFiles]
  );

  const handleBrowseClick: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        if (event.target.files) {
          setIsDisabled(true);

          const files = [];
          for (let i = 0; i < (event.target.files.length ?? 0); i++) {
            files.push(event.target.files[i]);
          }
          loadEmails(files);
          setFileStates(
            files.map((file) => {
              return { name: file.name, state: "loading" };
            })
          );
        }
      },
      [loadEmails]
    );

  const handleSubmit = useCallback(() => {
    postSendEmails(candidatesEmails.current)
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
  }, []);

  const isSendDisabled = isDisabled || candidatesEmails.current?.length === 0;

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
      <FilesPreview files={fileStates} />
      <Button
        onClick={handleSubmit}
        isDisabled={isSendDisabled}
        title={"Send"}
      />
    </div>
  );
};

export default BrowseSection;
