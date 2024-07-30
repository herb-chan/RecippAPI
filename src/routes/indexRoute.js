const express = require("express");
const router = express.Router();

/**
 * Basic route
 * @name GET /
 * @function
 * @memberof module:recipp_app
 * @inner
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.get("/", (req, res) => {
    res.send("Hello, Recipp API!");
});

module.exports = router;
