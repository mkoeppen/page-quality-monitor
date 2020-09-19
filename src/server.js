'use strict';
const { loadNuxt, build } = require('nuxt');
const express = require('express');
const cors         = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config();
const api       = require("./api");

// Constants
const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.NODE_PORT || 3000;

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

  app.use(cors())
      .use(bodyParser.urlencoded({ extended: false }))
      .use(bodyParser.json())
      .use("/api", api)
      .use(nuxt.render)

  // Build only in dev mode with hot-reloading
  if (isDev) {
    build(nuxt)
  }
  // Listen the server
  app.use((_req, res) => res.status(404).json({ success: false,error: "Route not found" }))
      .listen(port, () => console.log(`Server ready on port ${port}`));
}

start()