const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

/**
 * Represents a Recipe.
 * @typedef {Object} Recipe
 * @property {string} title The title of the recipe.
 * @property {string} description A brief description of the recipe.
 * @property {string} image The file path to an image representing the recipe.
 * @property {number} readyInTime The total time required to prepare the recipe, including cooking and preparation time, in minutes.
 * @property {number} cookingTime The time required to cook the recipe in minutes.
 * @property {number} preparationTime The time required to prepare the recipe in minutes.
 * @property {number} servingSize The number of servings the recipe yields.
 * @property {string} cuisine The cuisine of the dish (e.g., Chinese, Italian).
 * @property {string} type The type of dish (e.g., Main Course, Dessert).
 * @property {Array<string>} steps An array of step-by-step instructions for preparing the recipe.
 * @property {Array<string>} [intolerances] An optional array of intolerances that the recipe might cause.
 * @property {Array<string>} [diets] An optional array of dietary categories the recipe fits (e.g., vegan, gluten-free).
 * @property {Array<Object>} ingredients An array of ingredient objects used in the recipe.
 * @property {Object} nutrition An object containing nutritional information.
 * @property {Array<string>} equipment An array of equipment needed to prepare the recipe.
 * @property {number} starCount The number of stars given to the recipe, indicating its popularity or rating.
 */

/**
 * Sequelize model for the Recipe entity.
 * @type {import('sequelize').Model<Recipe>}
 */
const Recipe = sequelize.define("Recipe", {
    // Recipe title
    title: {
        type: DataTypes.STRING,
        allowNull: false, // Required field
    },

    // Short description of the recipe
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // Path to the recipe image
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // Total preparation time including cooking and prep, in minutes
    readyInTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // Time required for cooking, in minutes
    cookingTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // Time required for preparation, in minutes
    preparationTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // The number of servings this recipe yields
    servingSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // Type of cuisine, e.g., Italian, Chinese
    cuisine: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // The type of dish, e.g., Main Course, Dessert
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // An array of steps describing how to prepare the recipe
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

    // Optional array of intolerances (e.g., gluten, lactose)
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

    // Optional array of diets (e.g., vegan, gluten-free)
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

    // Array of ingredient objects used in the recipe
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

    // Nutritional information (e.g., calories, fat, carbs, protein)
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
                    if (!value[field] || typeof value[field] !== "object") {
                        throw new Error(
                            `Nutrition must include a valid ${field} object`
                        );
                    }
                });
            },
        },
    },

    // An array of kitchen equipment required to prepare the recipe
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

    // Star rating for the recipe, default is 0
    starCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

module.exports = Recipe;
