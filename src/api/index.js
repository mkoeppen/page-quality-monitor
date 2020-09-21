const express    = require("express");
const controller = require("../controllers");
const routes     = express.Router();

routes.route("/automated-tests").get(controller.getAutomatedTests);
routes.route("/automated-tests").post(controller.addAutomatedTest);
routes.route("/automated-tests").put(controller.updateAutomatedTest);
routes.route("/automated-tests/:id").delete(controller.deleteAutomatedTest);

module.exports = routes;