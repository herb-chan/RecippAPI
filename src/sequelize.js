const { Sequelize } = require("sequelize");
const path = require("path");

// Construct the path to the database file
const databasePath = path.join(__dirname, "../database", "Recipes.sqlite");

/**
 * Sequelize instance configured for the SQLite database.
 * @type {Sequelize}
 */
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: databasePath,
    logging: false,
});

module.exports = sequelize;
