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
    steps: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
            return this.getDataValue("steps").split(";");
        },
        set(val) {
            this.setDataValue("steps", val.join(";"));
        },
    },
    allergies: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            return this.getDataValue("allergies").split(";");
        },
        set(val) {
            this.setDataValue("allergies", val.join(";"));
        },
    },
    diets: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            return this.getDataValue("diets").split(";");
        },
        set(val) {
            this.setDataValue("diets", val.join(";"));
        },
    },
    starCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

module.exports = Recipe;
