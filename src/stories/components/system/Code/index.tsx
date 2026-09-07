import type { FC } from "react";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Vite bundles every component source as a lazy raw-text chunk, so the
// "Show code" stories work in dev and on any host without copying files
// into the build output.
const sources: Record<string, () => Promise<string>> = {
  ...import.meta.glob<string>("/src/stories/components/**/index.tsx", {
    query: "?raw",
    import: "default",
  }),
  // import.meta.glob skips the file that declares it, so this component's
  // own source is added explicitly for its story.
  "/src/stories/components/system/Code/index.tsx": () =>
    import("./index.tsx?raw").then((m) => m.default),
};

interface CodeProps {
  /** Component folder relative to the repo root, e.g. "src/stories/components/atoms/Loader/". */
  directoryPath: string;
}

export const Code: FC<CodeProps> = ({ directoryPath }) => {
  const [source, setSource] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = `/${directoryPath.replace(/^\/+|\/+$/g, "")}/index.tsx`;
    const load = sources[key];

    if (!load) {
      setError(`No component source found at ${key}`);
      return;
    }

    let cancelled = false;
    setError(null);
    load()
      .then((text) => {
        if (!cancelled) setSource(text);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      });

    return () => {
      cancelled = true;
    };
  }, [directoryPath]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="px-[6.5px]">
      <SyntaxHighlighter language="tsx" style={vscDarkPlus} showLineNumbers>
        {source}
      </SyntaxHighlighter>
    </div>
  );
};
