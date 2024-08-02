const express = require("express");
const { Op, literal } = require("sequelize");
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
    try {
        const recipes = await Recipe.findAll();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching the recipes",
            error: error.message,
        });
    }
});

/**
 * Route to get random recipes
 * @name GET /recipes/random
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.get("/recipes/random", async (req, res) => {
    try {
        const {
            diets,
            intolerances,
            cuisines,
            types,
            excludedDiets,
            excludedIntolerances,
            excludedCuisines,
            excludedTypes,
            amount,
        } = req.query;

        const whereConditions = [];

        if (diets) {
            const dietsArray = Array.isArray(diets)
                ? diets
                : diets.split(",").map((d) => d.trim().toLowerCase());
            dietsArray.forEach((diet) => {
                whereConditions.push(
                    literal(
                        `EXISTS (SELECT 1 FROM json_each(diets) WHERE json_each.value LIKE '%${diet}%')`
                    )
                );
            });
        }

        if (intolerances) {
            const intolerancesArray = Array.isArray(intolerances)
                ? intolerances
                : intolerances.split(",").map((i) => i.trim().toLowerCase());
            intolerancesArray.forEach((intolerance) => {
                whereConditions.push(
                    literal(
                        `EXISTS (SELECT 1 FROM json_each(intolerances) WHERE json_each.value LIKE '%${intolerance}%')`
                    )
                );
            });
        }

        if (cuisines) {
            const cuisinesArray = Array.isArray(cuisines)
                ? cuisines
                : cuisines.split(",").map((c) => c.trim().toLowerCase());
            cuisinesArray.forEach((cuisine) => {
                whereConditions.push(
                    literal(
                        `EXISTS (SELECT 1 FROM json_each(cuisine) WHERE json_each.value LIKE '%${cuisine}%')`
                    )
                );
            });
        }

        if (types) {
            const typesArray = Array.isArray(types)
                ? types
                : types.split(",").map((t) => t.trim().toLowerCase());
            typesArray.forEach((type) => {
                whereConditions.push(
                    literal(
                        `EXISTS (SELECT 1 FROM json_each(type) WHERE json_each.value LIKE '%${type}%')`
                    )
                );
            });
        }

        if (excludedDiets) {
            const excludedDietsArray = Array.isArray(excludedDiets)
                ? excludedDiets
                : excludedDiets.split(",").map((d) => d.trim().toLowerCase());
            excludedDietsArray.forEach((diet) => {
                whereConditions.push(
                    literal(
                        `NOT EXISTS (SELECT 1 FROM json_each(diets) WHERE json_each.value LIKE '%${diet}%')`
                    )
                );
            });
        }

        if (excludedIntolerances) {
            const excludedIntolerancesArray = Array.isArray(
                excludedIntolerances
            )
                ? excludedIntolerances
                : excludedIntolerances
                      .split(",")
                      .map((i) => i.trim().toLowerCase());
            excludedIntolerancesArray.forEach((intolerance) => {
                whereConditions.push(
                    literal(
                        `NOT EXISTS (SELECT 1 FROM json_each(intolerances) WHERE json_each.value LIKE '%${intolerance}%')`
                    )
                );
            });
        }

        if (excludedCuisines) {
            const excludedCuisinesArray = Array.isArray(excludedCuisines)
                ? excludedCuisines
                : excludedCuisines
                      .split(",")
                      .map((c) => c.trim().toLowerCase());
            excludedCuisinesArray.forEach((cuisine) => {
                whereConditions.push(
                    literal(
                        `NOT EXISTS (SELECT 1 FROM json_each(cuisine) WHERE json_each.value LIKE '%${cuisine}%')`
                    )
                );
            });
        }

        if (excludedTypes) {
            const excludedTypesArray = Array.isArray(excludedTypes)
                ? excludedTypes
                : excludedTypes.split(",").map((t) => t.trim().toLowerCase());
            excludedTypesArray.forEach((type) => {
                whereConditions.push(
                    literal(
                        `NOT EXISTS (SELECT 1 FROM json_each(type) WHERE json_each.value LIKE '%${type}%')`
                    )
                );
            });
        }

        const filteredRecipes = await Recipe.findAll({
            where: {
                [Op.and]: whereConditions,
            },
        });

        if (filteredRecipes.length === 0) {
            return res
                .status(404)
                .json({ message: "No recipes found matching the criteria" });
        }

        const randomRecipesArray = [];
        const amountNum = amount ? parseInt(amount, 10) : 1;

        const selectedRecipes = new Set();

        while (
            randomRecipesArray.length < amountNum &&
            selectedRecipes.size < filteredRecipes.length
        ) {
            const randomIndex = Math.floor(
                Math.random() * filteredRecipes.length
            );
            const randomRecipe = filteredRecipes[randomIndex];

            if (!selectedRecipes.has(randomRecipe.id)) {
                selectedRecipes.add(randomRecipe.id);
                randomRecipesArray.push(randomRecipe);
            }
        }

        res.json(randomRecipesArray);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({
            message: "An error occurred while fetching a random recipe",
            error: error.message,
        });
    }
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
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: "Recipe not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching the recipe",
            error: error.message,
        });
    }
});

/**
 * Route to get similar recipes by ID
 * @name GET /recipes/:id/similar
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.get("/recipes/:id/similar", async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.query;
        const recipe = await Recipe.findByPk(id);

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        const similarRecipes = await Recipe.findAll({
            where: {
                cuisine: recipe.cuisine,
                id: { [Op.ne]: id },
            },
            limit: amount ? parseInt(amount, 10) : undefined,
        });

        res.json(similarRecipes);
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching similar recipes",
            error: error.message,
        });
    }
});

/**
 * Route to star a recipe
 * @name POST /recipes/:id/star
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.post("/recipes/:id/star", async (req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (recipe) {
            recipe.starCount = (recipe.starCount || 0) + 1;
            await recipe.save();
            res.json({
                message: "Recipe starred successfully",
                starCount: recipe.starCount,
            });
        } else {
            res.status(404).json({ message: "Recipe not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while starring the recipe",
            error: error.message,
        });
    }
});

module.exports = router;
