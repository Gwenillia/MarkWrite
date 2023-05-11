import "./styles/App.sass";
import { Aside, Content } from "./components";
import { createSignal } from "solid-js";

declare global {
  interface Window {
    electron: {
      readFile(filePath: string): Promise<string>;
      writeFile(filePath: string, data: string): Promise<void>;
    };
  }
}

export default function App() {
  const [displayAside, setDisplayAside] = createSignal(true);

  // global keyboard listener for ctrl/cmd + s to toggle aside
  window.addEventListener("keydown", (e) => {
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      setDisplayAside(!displayAside());
    }
  });

  return (
    <main>
      {displayAside() && <Aside/>}
      <Content/>
    </main>
  );
}
