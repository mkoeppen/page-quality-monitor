const express    = require("express");
const routes     = express.Router();

/**
 * AUTOMATED TESTS
 */
const automatedTestsController = require("../controllers/automatedTests");
routes.route("/automated-tests").get(automatedTestsController.getAutomatedTests);
routes.route("/automated-tests").post(automatedTestsController.addAutomatedTest);
routes.route("/automated-tests").put(automatedTestsController.updateAutomatedTest);
routes.route("/automated-tests/:id").delete(automatedTestsController.deleteAutomatedTest);

/**
 * REPORTS
 */

const reportsController = require("../controllers/reports");
routes.route("/reports").get(reportsController.getReports);
routes.route("/reports").post(reportsController.addReport);
routes.route("/reports").put(reportsController.updateReport);
routes.route("/reports/:id").delete(reportsController.deleteReport);


module.exports = routes;