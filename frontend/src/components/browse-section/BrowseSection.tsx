import React, { useCallback, useRef } from "react";
import { useState } from "react";
import { Button } from "./components/button/Button";
import { useFileReader } from "./hooks/useFileReader";
import FilesPreview from "./components/files-preview/FilesPreview";
import { AlertMessage, FileState } from "src/types";
import "./BrowseSection.css";
import { postSendEmails } from "src/api";
import Alert from "../alert/Alert";
import { PostSendEmailsResponse } from "src/api/api.types";

interface BrowseSectionProps {}

/**
 * Section that handles the upload and submit of files
 */
const BrowseSection: React.FC<BrowseSectionProps> = () => {
  // Used to disable buttons when in a loading state
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  // Used to show info about the uploaded files
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  // The message shown in the alert
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputValueRef = useRef<string>();
  const candidatesEmails = useRef<string[]>([]);

  // Disables send button
  const isSendDisabled = isDisabled || candidatesEmails.current?.length === 0;

  // Closes the alert on click
  const closeAlert = () => {
    setAlertMessage(null);
  };

  // Ties the click of the Browse button to the hidden input element
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

  // Cleans all data about the current form
  const cleanForm = () => {
    inputValueRef.current = "";
    candidatesEmails.current = [];
    setFileStates([]);
  };

  // Receives an array of files and loads the emails in their specific array
  const loadEmails = useCallback(
    (files: File[]) => {
      // Clears the array
      candidatesEmails.current = [];

      readFiles(files)
        .then((response) => {
          response.forEach((data) => {
            data.split(/\r?\n/).forEach((line) => {
              line.trim().length > 0 && candidatesEmails.current.push(line);
            });
          });
        })
        .catch(() => {
          setAlertMessage({
            message: "There was a problem while reading the files!",
            type: "error",
          });
        })
        .finally(() => {
          setIsDisabled(false);
        });
    },
    [readFiles]
  );

  // Disables buttons while loading the new files, every time the input value changes
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> =
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

  // Sends the email addresses
  const handleSubmit = useCallback(() => {
    // Blocks the buttons while waiting for a response
    setIsDisabled(true);

    // On success alerts the user and also cleans the form
    const onSuccess = () => {
      setAlertMessage({
        message: "All emails have been sent!",
        type: "success",
      });
      cleanForm();

      setIsDisabled(false);
    };

    // On failure alerts the user with a failure alert
    const onFailure = (response?: PostSendEmailsResponse) => {
      const message = response?.emails
        ? response?.error === "send_failure"
          ? "Failed to send emails to the following addresses: " +
            response.emails.join(", ")
          : response?.error === "invalid_email_address"
          ? "Some of the emails were not valid: " + response.emails.join(", ")
          : "Something went wrong!"
        : "Something went wrong!";

      setAlertMessage({
        message: message,
        type: "error",
      });

      setIsDisabled(false);
    };

    postSendEmails(candidatesEmails.current, onSuccess, onFailure);
  }, []);

  return (
    <div className="browse_section">
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
        onChange={handleInputChange}
        className="browse_section_files_input"
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
