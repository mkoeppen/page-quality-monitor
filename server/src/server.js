'use strict';
const { loadNuxt, build } = require('nuxt');
const express = require('express');

// Constants
const isDev = process.env.NODE_ENV !== 'production'
const port = 3000;
const host = '0.0.0.0';

// App
const app = express();

// app.use(express.json())

// app.get('/', (req, res) => {
//     res.send(`PQM Server is running`);
// });

// app.get('/generate-report/:website', (req, res) => {
//   res.send(`generate: ${req.params.website}`);
// });

// app.listen(port, host);
// console.log(`Running on http://${host}:${port}`);


async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  app.get('/generate-report/:website', (req, res) => {
    res.send(`generate: ${req.params.website}`);
  });

  // Render every route with Nuxt.js
  app.use(nuxt.render)

  // Build only in dev mode with hot-reloading
  if (isDev) {
    build(nuxt)
  }
  // Listen the server
  app.listen(port, '0.0.0.0')
  console.log('Server listening on `localhost:' + port + '`.')
}

start()