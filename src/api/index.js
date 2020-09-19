const express    = require("express");
const controller = require("../controllers");
const routes     = express.Router();

routes.route("/automated-tests").get(controller.getAutomatedTests);
routes.route("/automated-tests/create").post(controller.addAutomatedTest);

module.exports = routes;