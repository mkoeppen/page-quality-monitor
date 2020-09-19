const model = require("../models");

/**
 * @function getAutomatedTests
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

async function getAutomatedTests(req, res) {
  const query  = req.query;

  if (!query.text) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter: text"
    });

    return;
  }

  try {

    const result = await model.getAutomatedTests(req.query);
    res.json({ success: true, data: result });

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }
}

/**
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

async function addAutomatedTest(req, res) {

  const body = req.body;

  if (!body.name || !body.url) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter(s): 'body', 'name' or 'url'"
    });

    return;
  }

  try {

    const result = await model.insertNewAutomatedTest(body);
    res.json({ 
      success: true, 
      data: {
        id:     result.body._id,
        name: body.name,
        url:  body.url,
        tags:  body.tags,
        interval:  body.interval,
        color:  body.color,
      } 
    });

  } catch (err) {
    res.status(500).json({ success: false, error: "Unknown error."});
  }

}

module.exports = {
  getAutomatedTests,
  addAutomatedTest
};