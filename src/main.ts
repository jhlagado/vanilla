import "./style.css";
import viteLogo from "/vite.svg";
import { serviceWorkerFile } from "virtual:vite-plugin-service-worker";

navigator.serviceWorker
  .register(serviceWorkerFile, {
    type: "module",
  })
  .then(function (reg) {
    reg.addEventListener("updatefound", function () {
      const installingWorker = reg.installing;
      console.log("A new service worker is being installed:", installingWorker);
    });
    console.log("Registration succeeded. Scope is " + reg.scope);
  })
  .catch(function (error) {
    console.log("Registration failed with " + error);
  });

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <iframe src="/contacts?q=xyz"></iframe>
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
