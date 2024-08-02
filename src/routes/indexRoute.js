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
    res.send(
        "For more informations about RecippAPI see: https://www.github.com/herb-chan/RecippAPI"
    );
});

module.exports = router;
