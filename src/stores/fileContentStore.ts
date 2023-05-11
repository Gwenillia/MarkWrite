import { onCleanup } from "solid-js";

let content = "";

interface Listener {
  callback: (content: string) => void;
}

const listeners: Listener[] = [];

export const fileContentStore = {
  subscribe(callback: (content: string) => void) {
    const listener: Listener = {callback};
    listeners.push(listener);

    onCleanup(() => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    });

    callback(content);
  },
  update(newContent: string) {
    content = newContent;
    listeners.forEach((listener) => listener.callback(newContent));
  },
  getContent(): string {
    return content;
  },
};
