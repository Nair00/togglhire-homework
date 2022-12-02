export const useFileReader = ({
  onFileReadSuccess,
  onFileReadFailure,
}: {
  onFileReadSuccess?: (index: number) => void;
  onFileReadFailure?: (index: number) => void;
}) => {
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

  const readFiles = async (files: File[]) => {
    const results = await Promise.all(
      files.map((file: File, index: number) => {
        const fileContents = handleFile(file, index)
          .then((contents) => contents)
          .catch((e) => {
            console.log("[FileReader error]", e);
            return "";
          });
        return fileContents;
      })
    );

    return results;
  };

  return { readFiles };
};
