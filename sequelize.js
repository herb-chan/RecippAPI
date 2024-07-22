const { Sequelize } = require("sequelize");
const path = require("path");

// Construct the path to the database file
const databasePath = path.join(__dirname, "database", "Recipes.sqlite");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: databasePath,
});

module.exports = sequelize;
