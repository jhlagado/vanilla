export const layout = (
  messages: string[] = [],
  content = "no content"
) => `<!doctype html>
  <html lang="">
  <head>
      <title>Contact App</title>
      <link rel="stylesheet" href="https://the.missing.style/v0.2.0/missing.min.css">
      <link rel="stylesheet" href="/static/site.css">
      <script src="/static/js/htmx-1.8.0.js"></script>
      <script src="/static/js/_hyperscript-0.9.7.js"></script>
      <script src="/static/js/rsjs-menu.js" type="module"></script>
      <script defer src="https://unpkg.com/alpinejs@3/dist/cdn.min.js"></script>
  </head>
  <body hx-boost="true">
  <main>
      <header>
          <h1>
              <all-caps>contacts.app</all-caps>
              <sub-title>A Demo Contacts Application</sub-title>
          </h1>
      </header>
      ${messages
        .map((message) => `<div class="flash">${message}}</div>`)
        .join()}
      ${content}
  </main>
  </body>
  </html>`;
