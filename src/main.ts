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
  <iframe name="iframe3" src="/contacts/1"></iframe>
  <form target="iframe3" action="/contacts" method="POST">
    <input type="text" name="title" value="123">
    <button>Submit</button>
  </form>
  <img src="${viteLogo}" class="logo" alt="Vite logo" />
  <a href="https://vitejs.dev" target="_blank">
  </div>
  `;
};
run();
