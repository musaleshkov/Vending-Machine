import { createApp } from './app.js';

const parsedPort = Number(process.env.PORT ?? 3001);
const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3001;
const app = createApp();

app.listen(port, () => {
  console.log(`Mock API listening on http://localhost:${port}`);
});
