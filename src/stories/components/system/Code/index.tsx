import type { FC } from "react";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeProps {
  directoryPath: string;
}

export const Code: FC<CodeProps> = ({ directoryPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Construir la ruta completa al archivo README.md utilizando la ruta del directorio
    const readmePath = `${directoryPath}README.md`;


    // Llamar a la función fetch con la ruta proporcionada para obtener el contenido del archivo README.md
    fetch(readmePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "File README.md not found in the specified directory"
          );
        }
        return response.text();
      })
      .then((text) => setMarkdownContent(text))
      .catch((error) => setError(error.message));
  }, [directoryPath]); // Dependencia: se volverá a ejecutar cuando cambie la ruta del directorio

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="px-[6.5px]">
      <SyntaxHighlighter language="tsx" style={vscDarkPlus} showLineNumbers>
        {markdownContent}
      </SyntaxHighlighter>
    </div>
  );
};
