import React from "react";
import { Button } from "../components/button/Button";
import "./DragAndDrop.css";

interface DragAndDropProps {
  /**
   * Handles the files when dropped or when the upload button is clicked
   */
  handleFiles: (files: FileList) => void;
  /**
   * Overrides the current ref in case it's needed for external control
   * Eg: clearing input
   */
  refOverride?: React.RefObject<HTMLInputElement>;
  /**
   * A ref for the input's value
   * Can be used to change the value from outside the component
   */
  inputValueRef?: React.MutableRefObject<string>;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  handleFiles,
  refOverride,
  inputValueRef,
}) => {
  const [dragActive, setDragActive] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const ref = refOverride ?? inputRef;

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement | HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Triggers when file is dropped
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Triggers when file is selected with click
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Triggers the input when the button is clicked
  const onButtonClick = () => {
    ref.current?.click();
  };

  return (
    <form
      className={"drag_and_drop_form"}
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={ref}
        type="file"
        className={"drag_and_drop_input"}
        multiple={true}
        onChange={handleChange}
        value={inputValueRef?.current}
      />
      <label
        className={"drag_and_drop_label"}
        htmlFor="input-file-upload"
        id={dragActive ? "drag-active" : ""}
      >
        <div>
          <p>{"Drag and drop your files here or"}</p>
          <Button onClick={onButtonClick} title={"Upload a file"} />
        </div>
      </label>
      {dragActive && (
        <div
          className={"drag_and_drop_element"}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
};

export default DragAndDrop;
