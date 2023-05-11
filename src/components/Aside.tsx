import styles from '../styles/components/Aside.module.sass'
import { createEffect, createSignal } from "solid-js";
import { fileContentStore } from "../stores/fileContentStore";

export const Aside = () => {
  const [title, setTitle] = createSignal(fileContentStore.getContent().split('\n')[0]);
  createEffect(() => {
    return fileContentStore.subscribe((content) => {
      console.log(content)
      setTitle(content.split('\n')[0]);
    });
  });

  return (
    <aside class={styles.container}>
      <h1>{title()}</h1>
    </aside>
  );
};
