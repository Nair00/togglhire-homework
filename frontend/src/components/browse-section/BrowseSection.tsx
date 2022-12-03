import React, { useCallback, useRef } from "react";
import { useState } from "react";
import { Button } from "./components/button/Button";
import { useFileReader } from "./hooks/useFileReader";
import FilesPreview from "./components/files-preview/FilesPreview";
import { AlertMessage, FileState } from "src/types";
import "./BrowseSection.css";
import { postSendEmails } from "src/api";
import Alert from "../alert/Alert";

interface BrowseSectionProps {}

const BrowseSection: React.FC<BrowseSectionProps> = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputValueRef = useRef<string>();
  const candidatesEmails = useRef<string[]>([]);

  const isSendDisabled = isDisabled || candidatesEmails.current?.length === 0;

  const closeAlert = () => {
    setAlertMessage(null);
  };

  const onBrowseClick = () => {
    inputRef.current?.click();
  };

  const onFileReadFailure = (index: number) => {
    setFileStates((prev) => {
      prev[index].state = "failed";
      return prev;
    });
  };

  const onFileReadSuccess = (index: number) => {
    setFileStates((prev) => {
      prev[index].state = "success";
      return prev;
    });
  };

  const { readFiles } = useFileReader({ onFileReadSuccess, onFileReadFailure });

  const cleanForm = () => {
    inputValueRef.current = "";
    candidatesEmails.current = [];
    setFileStates([]);
  };

  const loadEmails = useCallback(
    (files: File[]) => {
      candidatesEmails.current = [];
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

  const handleInputClick: React.ChangeEventHandler<HTMLInputElement> =
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
      [loadEmails, setFileStates]
    );

  const handleSubmit = useCallback(() => {
    postSendEmails(candidatesEmails.current)
      .then(async (r: Response) => {
        if (r.ok) {
          setAlertMessage({
            message: "All emails have been sent!",
            type: "success",
          });
          cleanForm();
        } else {
          r.json().then((data) => {
            const message =
              data.error === "send_failure"
                ? "Failed to send emails to the following addresses: " +
                  data.emails
                : (data.error = "invalid_email_address"
                    ? "Some of the emails were not valid: " + data.emails
                    : "Something went wrong!");

            setAlertMessage({
              message: message,
              type: "error",
            });
          });
        }
      })
      .catch((e: any) => {
        console.log("E", e);
      });
  }, []);

  return (
    <div className="BrowseSection">
      <Button
        onClick={onBrowseClick}
        isDisabled={isDisabled}
        title={"Select Files"}
      />
      <input
        ref={inputRef}
        id="files"
        type="file"
        multiple
        accept={"text/txt"}
        onChange={handleInputClick}
        className="browse_files_input"
        disabled={isDisabled}
        value={inputValueRef.current}
      />
      <FilesPreview files={fileStates} />
      <Button
        onClick={handleSubmit}
        isDisabled={isSendDisabled}
        title={"Send"}
      />
      {alertMessage && (
        <Alert
          message={alertMessage.message}
          type={alertMessage.type}
          onClick={closeAlert}
        />
      )}
    </div>
  );
};

export default BrowseSection;
