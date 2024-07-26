const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

/**
 * Represents a Recipe.
 * @typedef {Object} Recipe
 * @property {string} title - The title of the recipe.
 * @property {string} description - A brief description of the recipe.
 * @property {string} imagePath - The file path to an image representing the recipe.
 * @property {string} prepTime - The time required to prepare the recipe.
 * @property {string} servingSize - The number of servings the recipe yields.
 * @property {string} category - The category or type of the recipe (e.g., dessert, main course).
 * @property {Array<Object>} ingredients - An array of ingredient objects used in the recipe.
 * @property {Object} nutrition - An object containing nutritional information (e.g., calories, fat).
 * @property {Array<Object>} steps - An array of step-by-step instructions for preparing the recipe.
 * @property {Array<string>} [allergies] - An optional array of allergens that the recipe might contain.
 * @property {Array<string>} [diets] - An optional array of dietary categories the recipe fits (e.g., vegan, gluten-free).
 * @property {number} starCount - The number of stars given to the recipe, indicating its popularity or rating.
 */

/**
 * Sequelize model for Recipe.
 * @type {import('sequelize').Model<Recipe>}
 */
const Recipe = sequelize.define("Recipe", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imagePath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    prepTime: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    servingSize: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ingredients: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    nutrition: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    steps: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    allergies: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    diets: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    starCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

module.exports = Recipe;
