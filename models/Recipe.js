const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

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
