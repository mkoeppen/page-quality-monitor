const model = require("../models/automatedTests");

/**
 * @function getAutomatedTests
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

async function getAutomatedTests(req, res) {
  try {
    console.log('request get all');
    const result = await model.getAutomatedTests();
    res.json({ success: true, data: result });

  } catch (err) {
    res.status(500).json({ success: false, error: err});
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
    res.status(500).json({ success: false, error: err});
  }

}

/**
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

async function updateAutomatedTest(req, res) {

  const body = req.body;

  if (!body.id || !body.name || !body.url) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter(s): 'body', 'id', 'name' or 'url'"
    });

    return;
  }

  try {
    const result = await model.updateAutomatedTest(body);
    res.json({ 
      success: true, 
      data: result
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err});
  }

}

/**
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

async function deleteAutomatedTest(req, res) {

  const id = req.params.id;

  if (!id) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter(s): 'id'"
    });

    return;
  }

  try {
    await model.deleteNewAutomatedTest(id);
    res.json({ 
      success: true
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err});
  }

}

module.exports = {
  getAutomatedTests,
  addAutomatedTest,
  updateAutomatedTest,
  deleteAutomatedTest,
};