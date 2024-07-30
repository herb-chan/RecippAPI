const express = require("express");
const Recipe = require("../models/Recipe");

const router = express.Router();

/**
 * Route to get all recipes
 * @name GET /recipes
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.get("/recipes", async (req, res) => {
    const recipes = await Recipe.findAll();
    res.json(recipes);
});

/**
 * Route to get a single recipe by ID
 * @name GET /recipes/:id
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.get("/recipes/:id", async (req, res) => {
    const recipe = await Recipe.findByPk(req.params.id);
    if (recipe) {
        res.json(recipe);
    } else {
        res.status(404).json({ message: "Recipe not found" });
    }
});

module.exports = router;
