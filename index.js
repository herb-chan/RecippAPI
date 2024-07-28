require("dotenv").config();
const express = require("express");
const { Op, fn, col, literal } = require("sequelize");
const fs = require("fs");
const path = require("path");
const sequelize = require("./sequelize");
const Recipe = require("./models/Recipe");

const recipp_app = express();
const port = 3000;
const recipesFilePath = path.join(__dirname, "_recipes/recipes.json");

recipp_app.use(express.json());

/**
 * Synchronizes recipes from the JSON file with the database.
 * @async
 * @function
 */
const syncRecipes = async () => {
    const recipesData = readRecipesFromFile();
    for (const recipeData of recipesData) {
        const existingRecipe = await Recipe.findByPk(recipeData.id);
        if (existingRecipe) {
            // Compare existing recipe with JSON data
            const existingRecipeJson = existingRecipe.toJSON();
            delete existingRecipeJson.createdAt;
            delete existingRecipeJson.updatedAt;

            const dataToCompare = { ...recipeData };
            delete dataToCompare.createdAt;
            delete dataToCompare.updatedAt;

            if (
                JSON.stringify(existingRecipeJson) !==
                JSON.stringify(dataToCompare)
            ) {
                // Update recipe if it has changed
                await existingRecipe.update({
                    ...dataToCompare,
                    updatedAt: new Date(),
                });
            }
        } else {
            // Create new recipe if it doesn't exist
            await Recipe.create(recipeData);
        }
    }
};

sequelize.sync().then(async () => {
    console.log("Database & tables synchronized!");
    await syncRecipes();
    console.log("Recipes data synchronized!");
});

/**
 * Basic route
 * @name GET /
 * @function
 * @memberof module:recipp_app
 * @inner
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
recipp_app.get("/", (req, res) => {
    res.send("Hello, Recipp API!");
});

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
recipp_app.get("/recipes", async (req, res) => {
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
recipp_app.get("/recipes/:id", async (req, res) => {
    const recipe = await Recipe.findByPk(req.params.id);
    if (recipe) {
        res.json(recipe);
    } else {
        res.status(404).json({ message: "Recipe not found" });
    }
});

/**
 * Route to search for recipes by title
 * @name GET /search
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
recipp_app.get("/search", async (req, res) => {
    const query = req.query.q;
    const recipes = await Recipe.findAll({
        where: {
            title: {
                [Op.like]: `%${query}%`,
            },
        },
    });
    res.json(recipes);
});

/**
 * Route to search for recipes by ingredients
 * @name GET /searchByIngredients
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
recipp_app.get("/searchByIngredients", async (req, res) => {
    const ingredients = req.query.ingredients;
    if (!ingredients) {
        return res
            .status(400)
            .json({ message: "Ingredients query parameter is required" });
    }

    const ingredientArray = ingredients
        .split(",")
        .map((ing) => ing.trim().toLowerCase());

    const recipes = await Recipe.findAll({
        where: {
            [Op.and]: ingredientArray.map((ingredient) => {
                return literal(
                    `EXISTS (SELECT 1 FROM json_each(ingredients) WHERE json_each.value LIKE '%${ingredient}%')`
                );
            }),
        },
    });

    res.json(recipes);
});

/**
 * Route to search for recipes excluding certain ingredients
 * @name GET /searchByExcludedIngredients
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
recipp_app.get("/searchByExcludedIngredients", async (req, res) => {
    const ingredients = req.query.ingredients;
    if (!ingredients) {
        return res
            .status(400)
            .json({ message: "Ingredients query parameter is required" });
    }

    const ingredientArray = ingredients
        .split(",")
        .map((ing) => ing.trim().toLowerCase());

    const recipes = await Recipe.findAll({
        where: {
            [Op.and]: ingredientArray.map((ingredient) => {
                return literal(
                    `NOT EXISTS (SELECT 1 FROM json_each(ingredients) WHERE json_each.value LIKE '%${ingredient}%')`
                );
            }),
        },
    });

    res.json(recipes);
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
recipp_app.post("/recipes/:id/star", async (req, res) => {
    const recipe = await Recipe.findByPk(req.params.id);
    if (recipe) {
        recipe.starCount += 1;
        await recipe.save();

        // Update the recipes.json file
        const recipes = readRecipesFromFile();
        const recipeIndex = recipes.findIndex((r) => r.id === recipe.id);
        if (recipeIndex !== -1) {
            recipes[recipeIndex].starCount = recipe.starCount;
            writeRecipesToFile(recipes);
        }

        res.json({
            message: "Recipe starred successfully",
            starCount: recipe.starCount,
        });
    } else {
        res.status(404).json({ message: "Recipe not found" });
    }
});

recipp_app.listen(port, () => {
    console.log(`Recipp API server running at http://localhost:${port}`);
});

/**
 * Reads recipes from the JSON file.
 * @function
 * @returns {Array<Object>} An array of recipes.
 */
const readRecipesFromFile = () => {
    const data = fs.readFileSync(recipesFilePath);
    return JSON.parse(data);
};

/**
 * Writes recipes to the JSON file.
 * @function
 * @param {Array<Object>} recipes An array of recipes.
 */
const writeRecipesToFile = (recipes) => {
    fs.writeFileSync(recipesFilePath, JSON.stringify(recipes, null, 2));
};
