const { Sequelize } = require("sequelize");
const path = require("path");

// Construct the absolute path to the SQLite database file located in the 'database' directory
const databasePath = path.join(__dirname, "../database", "Recipes.sqlite");

/**
 * Sequelize instance configured for the SQLite database.
 * @type {Sequelize}
 * @description This instance connects to the SQLite database file at the specified path.
 * - `dialect`: Specifies that SQLite is being used.
 * - `storage`: Defines the location of the SQLite database file.
 * - `logging`: Set to `false` to disable SQL query logging.
 */
const sequelize = new Sequelize({
    dialect: "sqlite", // Specify the database dialect (SQLite in this case)
    storage: databasePath, // Location of the SQLite database file
    logging: false, // Disable SQL query logging for a cleaner console output
});

module.exports = sequelize; // Export the configured Sequelize instance for use in other modules
