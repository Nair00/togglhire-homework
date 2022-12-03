/**
 * Returns a function that reads from an array of files and returns an
 * array with the same length with their contents
 */
export const useFileReader = ({
  onFileReadSuccess,
  onFileReadFailure,
}: {
  /**
   * Called when a file has been read with success, passing the index
   * in the original array as prop
   */
  onFileReadSuccess?: (index: number) => void;
  /**
   * Called when a file fails to be read, passing the index in the
   * original array as prop
   */
  onFileReadFailure?: (index: number) => void;
}) => {
  // Reads from a single file
  const handleFile = async (file: File, index: number) => {
    return new Promise((resolve: (contents: string) => void, reject) => {
      let fileReader = new FileReader();

      fileReader.onloadend = () => {
        onFileReadSuccess?.(index);
        resolve(fileReader.result as string);
      };

      fileReader.onerror = () => {
        onFileReadFailure?.(index);
        return reject();
      };

      fileReader.readAsText(file, "utf-8");
    });
  };

  // Reads async from multiple files
  const readFiles = async (files: File[]) => {
    const results = await Promise.all(
      files.map((file: File, index: number) => {
        const fileContents = handleFile(file, index)
          .then((contents) => contents)
          .catch((error) => {
            // If a file fails to be processed it will return an empty string
            console.log("[FileReader error]", error);
            return "";
          });
        return fileContents;
      })
    );

    return results;
  };

  return { readFiles };
};
