import "./style.css";
import viteLogo from "/vite.svg";

const run = async () => {
  await navigator.serviceWorker.register("service-worker.js", {
    scope: "./",
  });
  await navigator.serviceWorker.ready;
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <iframe src="/contacts"></iframe>
  <iframe src="/contacts/1"></iframe>
  <img src="${viteLogo}" class="logo" alt="Vite logo" />
  <a href="https://vitejs.dev" target="_blank">
  </div>
  `;
};
run();
