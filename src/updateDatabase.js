require("dotenv").config();
const sequelize = require("./sequelize");
const Recipe = require("./models/Recipe");
const fs = require("fs");
const path = require("path");

const recipesFilePath = path.join(__dirname, "_recipes/recipes.json");

/**
 * Reads recipes from the JSON file.
 * @returns {Array} Array of recipe objects
 */
const readRecipesFromFile = () => {
    const fileContent = fs.readFileSync(recipesFilePath, "utf-8");
    return JSON.parse(fileContent);
};

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

sequelize
    .sync()
    .then(async () => {
        console.log("Database & tables synchronized!");
        await syncRecipes();
        console.log("Recipes data synchronized!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error synchronizing recipes:", error);
        process.exit(1);
    });
