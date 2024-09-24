/**
 * Configuration settings for the application.
 * @module config
 */

module.exports = {
    /**
     * The port on which the application will run.
     * @type {number}
     * @default 3000
     */
    port: 3000,

    /**
     * The default number of recipes to return when querying the database.
     * @type {number}
     * @default 10
     */
    recipe_amount: 10,
};
