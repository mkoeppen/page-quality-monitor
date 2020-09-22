const model = require("../models/reports");

/**
 * @function getReports
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

 async function getReports(req, res) {
  try {
    console.log('request get all');
    const result = await model.getReports();
    res.json({ success: true, data: result });

  } catch (err) {
    res.status(500).json({ success: false, error: err});
  }
}

/**
 * @function getNextTest
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 * @returns {void}
 */

async function getNextTest(req, res) {
  try {
    console.log('request get next text');
    const result = await model.getNextTest();
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

async function addReport(req, res) {

  const body = req.body;

  if (!body.url) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter(s): 'body', 'url'"
    });

    return;
  }

  try {
    const result = await model.insertReport(body);
    res.json({ 
      success: true, 
      data: {
        id:     result.body._id,
        automatedTestId: body.automatedTestId,
        url:  body.url,
        createdDateTime:  body.createdDateTime,
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

async function updateReport(req, res) {

  const body = req.body;

  if (!body.id || !body.url) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter(s): 'body', 'id', 'url'"
    });

    return;
  }

  try {
    const result = await model.updateReport(body);
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

async function deleteReport(req, res) {

  const id = req.params.id;

  if (!id) {
    res.status(422).json({
      error: true,
      data: "Missing required parameter(s): 'id'"
    });

    return;
  }

  try {
    await model.deleteReport(id);
    res.json({ 
      success: true
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err});
  }

}

module.exports = {
  getReports,
  getNextTest,
  addReport,
  updateReport,
  deleteReport,
};