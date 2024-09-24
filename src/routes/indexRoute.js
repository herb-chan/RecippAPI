const express = require("express");
const router = express.Router();

/**
 * @module recipp_app
 */

/**
 * GET /
 * Basic route to display information about RecippAPI.
 * @name GET /
 * @function
 * @memberof module:recipp_app
 * @inner
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
router.get("/", (req, res) => {
    res.send(
        "For more information about RecippAPI, visit: https://www.github.com/herb-chan/RecippAPI"
    );
});

module.exports = router;
