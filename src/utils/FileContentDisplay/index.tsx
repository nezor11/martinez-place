// FileContentDisplay.tsx
import type { FC } from "react";
import { useEffect, useState } from "react";

interface FileContentDisplayProps {
  fileName?: string;
}

const FileContentDisplay: FC<FileContentDisplayProps> = ({ fileName }) => {
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const response = await fetch(fileName || "");
        if (!response.ok) {
          throw new Error("Failed to fetch file");
        }
        const content = await response.text();
        setFileContent(content);
      } catch (error) {
        console.error("Error fetching file:", error);
        setFileContent(null);
      }
    };

    if (fileName) {
      fetchFileContent();
    }

    return () => {
      // Cleanup logic if needed
    };
  }, [fileName]);

  if (!fileContent && fileName) {
    return <div>Loading...</div>;
  }

  if (fileContent === null) {
    return <div>Error fetching file.</div>;
  }

  // Render the file content directly as plain text
  return (
    <div>
      <h2>Content of {fileName}:</h2>
      <pre style={{ backgroundColor: "#f4f4f4", padding: "10px" }}>
        {fileContent}
      </pre>
    </div>
  );
};

export default FileContentDisplay;
