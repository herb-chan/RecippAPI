// Load environment variables from .env file
require("dotenv").config();

// Import configuration settings and dependencies
const config = require("./config/config");
const express = require("express");
const helmet = require("helmet"); // Security middleware to set various HTTP headers
const morgan = require("morgan"); // Logging middleware to log requests to the console
const rateLimit = require("express-rate-limit"); // Rate-limiting middleware to prevent abuse
const cors = require("cors"); // Enable CORS (Cross-Origin Resource Sharing) for API access from other domains

// Import route handlers
const indexRoutes = require("./routes/indexRoute");
const recipeRoutes = require("./routes/recipesRoute");
const searchRoutes = require("./routes/searchRoute");

// Initialize Express application
const recipp_app = express();

// Set port from environment variables or fallback to config settings
const port = process.env.PORT || config.port;

// Define rate limit parameters
const max_requests = 100; // Max number of requests allowed
const requests_duration = 15; // Duration in minutes for the rate limit window

// Setup rate limiter middleware to prevent excessive requests
const limiter = rateLimit({
    windowMs: requests_duration * 60 * 1000, // Convert duration to milliseconds
    max: max_requests, // Set the max number of requests
    message: "Too many requests, please try again later.", // Message sent when limit is reached
    handler: (req, res) => {
        // Custom handler for rate limit breaches
        res.status(429).send(
            `You have exceeded the ${max_requests} request limit in ${requests_duration} ${
                requests_duration > 1 ? "minutes" : "minute"
            }!`
        );
    },
});

// Middleware to parse incoming JSON requests
recipp_app.use(express.json());

// Apply security, logging, CORS, and rate limiting middleware
recipp_app.use(limiter); // Apply rate-limiting
recipp_app.use(helmet()); // Apply security headers
recipp_app.use(morgan("dev")); // Log HTTP requests
recipp_app.use(cors()); // Enable CORS

// Use route handlers for API endpoints
recipp_app.use("/api", indexRoutes); // Handle index-related routes
recipp_app.use("/api", recipeRoutes); // Handle recipe-related routes
recipp_app.use("/api", searchRoutes); // Handle search-related routes

// Start the server and listen on the specified port
recipp_app.listen(port, () => {
    console.log(`RecippAPI running at: http://localhost:${port}`);
});
