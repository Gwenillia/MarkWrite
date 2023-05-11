import styles from '../styles/components/Content.module.sass'
import { createSignal, onMount } from "solid-js";
import { marked } from "marked";
import { fileContentStore } from "../stores/fileContentStore";

type TextType = string[];

export function Content() {
  const [text, setText] = createSignal<TextType>([]);
  const [html, setHtml] = createSignal("");
  const filePath = 'content.mkwrite';

  const handleInput = (e: Event) => {
    const target = e.target as HTMLDivElement;
    const lines = target.innerText.split('\n').filter(line => line.trim() !== '');
    setText(lines);
    fileContentStore.update(lines.join('\n'));
  };

  const handleConfirm = async () => {
    const markedText = marked(text().join('\n'));
    setHtml(markedText);
    await window.electron.writeFile(filePath, text().join('\n'));
    fileContentStore.update(text().join('\n'));
  };

  onMount(async () => {
    try {
      const fileContent = await window.electron.readFile(filePath);
      setHtml(fileContent);

      const markdownText = fileContent.replace(/<h1>(.*?)<\/h1>/g, "# $1");
      setText(markdownText.split('\n'));

      const markedText = marked(markdownText);
      setHtml(markedText);

      fileContentStore.update(fileContent);
    } catch (err) {
      console.error(err);
    }
  });

  return (
    <section
      class={styles.container}
      contentEditable={true}
      onInput={handleInput}
      onBlur={handleConfirm}
      innerHTML={html()}
    >
    </section>
  );
}
