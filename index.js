require("dotenv").config();
const express = require("express");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const sequelize = require("./sequelize");
const Recipe = require("./models/Recipe");

const recipp_app = express();
const port = 3000;
const recipesFilePath = path.join(__dirname, "_recipes/recipes.json");

recipp_app.use(express.json());

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

// Basic route
recipp_app.get("/", (req, res) => {
    res.send("Hello, Recipp API!");
});

// Route to get all recipes (Read)
recipp_app.get("/recipes", async (req, res) => {
    const recipes = await Recipe.findAll();
    res.json(recipes);
});

// Route to get a single recipe by ID (Read)
recipp_app.get("/recipes/:id", async (req, res) => {
    const recipe = await Recipe.findByPk(req.params.id);
    if (recipe) {
        res.json(recipe);
    } else {
        res.status(404).json({ message: "Recipe not found" });
    }
});

// Route to search for recipes by title
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

// Route to star a recipe
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

// Utility functions to read and write recipes.json
const readRecipesFromFile = () => {
    const data = fs.readFileSync(recipesFilePath);
    return JSON.parse(data);
};

const writeRecipesToFile = (recipes) => {
    fs.writeFileSync(recipesFilePath, JSON.stringify(recipes, null, 2));
};
