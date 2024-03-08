import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import x from "/x.html?url";
import { setupCounter } from "./counter.ts";

await navigator.serviceWorker.register("service-worker.js", {
  scope: "./",
});

navigator.serviceWorker.ready.then(() => {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <iframe src="${x}"></iframe>
  <a href="https://vitejs.dev" target="_blank">
  <img src="${viteLogo}" class="logo" alt="Vite logo" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
  <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
  </a>
  <h1>Vite + TypeScript</h1>
  <div class="card">
  <button id="counter" type="button"></button>
  </div>
  <p class="read-the-docs">
  Click on the Vite and TypeScript logos to learn more
  </p>
  </div>
  `;

  setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
});
