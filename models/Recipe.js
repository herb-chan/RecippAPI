const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

/**
 * Represents a Recipe.
 * @typedef {Object} Recipe
 * @property {string} title The title of the recipe.
 * @property {string} description A brief description of the recipe.
 * @property {string} image The file path to an image representing the recipe.
 * @property {number} preparationTime The time required to prepare the recipe in minutes.
 * @property {number} servingSize The number of servings the recipe yields.
 * @property {string} cuisine The cuisine of the dish (e.g., Chinese, Italian).
 * @property {string} type The type of dish (e.g., Main Course, Dessert).
 * @property {Array<string>} steps An array of step-by-step instructions for preparing the recipe.
 * @property {Array<string>} [intolerances] An optional array of intolerances that the recipe might cause.
 * @property {Array<string>} [diets] An optional array of dietary categories the recipe fits (e.g., vegan, gluten-free).
 * @property {Array<Object>} ingredients An array of ingredient objects used in the recipe.
 * @property {Object} nutrition An object of nutritional information.
 * @property {Array<string>} equipment An array of equipment needed to prepare the recipe.
 * @property {number} starCount The number of stars given to the recipe, indicating its popularity or rating.
 */

/**
 * Sequelize model for Recipe.
 * @type @type {import('sequelize').Model<Recipe>}
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
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    preparationTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    servingSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cuisine: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    steps: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error("Steps must be an array");
                }
            },
        },
    },
    intolerances: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            isArray(value) {
                if (value !== null && !Array.isArray(value)) {
                    throw new Error("Intolerances must be an array");
                }
            },
        },
    },
    diets: {
        type: DataTypes.JSON,
        allowNull: true,
        validate: {
            isArray(value) {
                if (value !== null && !Array.isArray(value)) {
                    throw new Error("Diets must be an array");
                }
            },
        },
    },
    ingredients: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error("Ingredients must be an array");
                }
            },
        },
    },
    nutrition: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isValidNutrition(value) {
                if (typeof value !== "object") {
                    throw new Error("Nutrition must be an object");
                }
                const requiredFields = ["calories", "fat", "carbs", "protein"];
                requiredFields.forEach((field) => {
                    if (
                        value[field] === undefined ||
                        typeof value[field] !== "object"
                    ) {
                        throw new Error(
                            `Nutrition must include a valid ${field} object`
                        );
                    }
                });
            },
        },
    },
    equipment: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isArray(value) {
                if (!Array.isArray(value)) {
                    throw new Error("Equipment must be an array");
                }
            },
        },
    },
    starCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

module.exports = Recipe;
