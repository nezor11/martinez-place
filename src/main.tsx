//maint.tsx
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./providers/index";
import "./styles/tailwind.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
