const express = require('express')
const bodyParser = require('body-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const db = require('../db');
const cron = require("node-cron");
const TestRunnerClass = require('../controllers/testRunner');
const testRunner = new TestRunnerClass();
const path = require('path');

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  let host, port;

  if(config.dev) {
    host = 'localhost';
    port = 3000;
  } else {
    host = nuxt.options.server.host || process.env.HOST || '127.0.0.1';
    port = nuxt.options.server.port || process.env.PORT || 3000;
  }

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
  app.get("/api/pages-with-scores", (req, res) => {
    db.getPagesWithScores().then((data) => {
        res.end(JSON.stringify(data));
    });
  })

  app.get("/api/page/:id", (req, res) => {
    db.getPageById(req.params.id).then((data) => {
        res.end(JSON.stringify(data));
    });
  })

  app.get("/api/page/:id/generate-report", (req, res) => {
    db.generatePageReport(req.params.id).then((data) => {
        res.end(JSON.stringify(data));
    });
  })

  app.get("/api/last-report-for-page/:id", (req, res) => {
    db.getLastReportForPage(req.params.id).then((data) => {
      let filepath = '';
      if(data && data[0].html_path) {
        if (config.dev) {
          // fix path for dev mode
          filepath = data[0].html_path.replace('/usr/share/reports', `${__dirname }/../../reports`);
        }
        res.sendFile(path.resolve(filepath));
        return;
      }

      // res.status(404).send('Not found');
      res.status(404).send(path.resolve(filepath));
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
  // app.get("/api/page/:id/last-report", (req, res) => {
  //   db.getLastReportByPageId(req.params.id).then((data) => {
  //       res.end(JSON.stringify(data));
  //   });
  // })

  app.get('/control/run', function(req, res) {
    testRunner.start();
    res.send('Test Runner started')
  })
  
  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Cron Job
  cron.schedule("*/10 * * * * *", function() {
    console.log("running a task 10 seconds");
    testRunner.start();
  });

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()