const express    = require("express");
const automatedTestsController = require("../controllers/automatedTests");
const routes     = express.Router();

routes.route("/automated-tests").get(automatedTestsController.getAutomatedTests);
routes.route("/automated-tests").post(automatedTestsController.addAutomatedTest);
routes.route("/automated-tests").put(automatedTestsController.updateAutomatedTest);
routes.route("/automated-tests/:id").delete(automatedTestsController.deleteAutomatedTest);

module.exports = routes;