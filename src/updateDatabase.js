// Load environment variables from .env file
require("dotenv").config();

// Import database and model
const sequelize = require("./sequelize"); // Sequelize instance
const Recipe = require("./models/Recipe"); // Recipe model

// Import file system and path utilities
const fs = require("fs");
const path = require("path");

// Construct the absolute path to the recipes JSON file
const recipesFilePath = path.join(__dirname, "../_recipes/recipes.json");

/**
 * Reads recipes from the JSON file.
 * @returns {Array} Array of recipe objects
 * @description Reads the contents of the recipes JSON file, parses it, and returns an array of recipe objects.
 */
const readRecipesFromFile = () => {
    const fileContent = fs.readFileSync(recipesFilePath, "utf-8"); // Read the file's content as a string
    return JSON.parse(fileContent); // Parse the JSON content into a JavaScript object
};

/**
 * Synchronizes recipes from the JSON file with the database.
 * @async
 * @function syncRecipes
 * @description This function reads the recipe data from the JSON file and syncs it with the database.
 * For each recipe:
 *  - If the recipe exists in the database, it updates it only if there are changes.
 *  - If the recipe doesn't exist, it creates a new record in the database.
 */
const syncRecipes = async () => {
    const recipesData = readRecipesFromFile(); // Read recipes from file

    // Iterate through each recipe in the JSON data
    for (const recipeData of recipesData) {
        // Check if the recipe already exists in the database using its primary key (id)
        const existingRecipe = await Recipe.findByPk(recipeData.id);

        if (existingRecipe) {
            // Convert the existing recipe to JSON and remove timestamps
            const existingRecipeJson = existingRecipe.toJSON();
            delete existingRecipeJson.createdAt;
            delete existingRecipeJson.updatedAt;

            // Remove timestamps from the incoming recipe data
            const dataToCompare = { ...recipeData };
            delete dataToCompare.createdAt;
            delete dataToCompare.updatedAt;

            // Check if the recipe data has changed
            if (
                JSON.stringify(existingRecipeJson) !==
                JSON.stringify(dataToCompare)
            ) {
                // Update the recipe if any data has changed, and update the timestamp
                await existingRecipe.update({
                    ...dataToCompare,
                    updatedAt: new Date(), // Update the 'updatedAt' timestamp to the current time
                });
            }
        } else {
            // Create a new recipe if it doesn't exist in the database
            await Recipe.create(recipeData);
        }
    }
};

// Synchronize the Sequelize models with the database
sequelize
    .sync() // Sync the database schema (create tables if they don't exist)
    .then(async () => {
        console.log("Database & tables synchronized!"); // Log success message for schema sync

        // Synchronize the recipes data from JSON file
        await syncRecipes();
        console.log("Recipes data synchronized!"); // Log success message for data sync
        process.exit(0); // Exit the process once synchronization is complete
    })
    .catch((error) => {
        console.error("Error synchronizing recipes:", error); // Log any errors
        process.exit(1); // Exit the process with error code 1 in case of failure
    });
