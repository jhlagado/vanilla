# installing vite, vitest, msw

based on https://www.youtube.com/watch?v=Aqz43LVbnTk

npm create vite@latest
npm i -D vitest
npm i -D msw

package.json

```
"scripts:{
    "test": "vitest --coverage"
}
```

npm i -D @testing-library/jest-dom @testing-library/react @testing-library/user-event jsdom

vite.config.ts

```
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
```

tsconfig.json

```
{
    "compilerOptions": {
        "types": [
            "vitest/globals"
        ],
    },
    "include": [
        "src",
        "src/test/setup.ts"
    ],
}
```

src/test/setup.ts

```
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
```

src/test/mocks/handlers.ts

```
import { HttpResponse, http } from "msw";
import { SERVER_URL } from "../../constants";

export const handlers = [
  http.get(SERVER_URL, () => {
    return HttpResponse.json(
      [
        {
          id: 1,
          todo: "Do something nice for someone I care about",
          completed: true,
          userId: 26,
        },
      ],
      { status: 200 }
    );
  }),
];

```

src/test/mocks/server.ts

```
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

```

## install Tailwind CSS

npm i -D postcss-cli autoprefixer tailwindcss
npx tailwindcss init -p

tailwind.config.js

```
/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      }
    },
  },
  plugins: [],
}
```

add to top of src/index.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Install Storybook

```
npx storybook@latest init
npm i -D @storybook/manager-api @storybook/theming
npm i -D @storybook/addon-a11y
```

## Install ESLint

npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npx eslint --init

# Install React Router

npm install react-router-dom localforage match-sorter sort-by
