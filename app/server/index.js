const express = require('express')
const bodyParser = require('body-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const db = require('../db');

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(bodyParser.json());

  /**
   * API
   */

  app.get("/api/pages", (req, res) => {
    db.getPages().then((data) => {
        res.end(JSON.stringify(data));
    });
  })

  app.post("/api/page", (req, res) => {
    db.savePage(req.body).then((data) => {
        res.end(JSON.stringify({
          id: data.insertId
        }));
    });
  })
  app.delete("/api/page/:id", (req, res) => {
    db.deletePage(req.params.id).then((data) => {
        res.end(JSON.stringify({}));
    });
  })
  
  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()