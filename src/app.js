require("dotenv").config();
const config = require("./config/config");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const indexRoutes = require("./routes/indexRoute");
const recipeRoutes = require("./routes/recipesRoute");
const searchRoutes = require("./routes/searchRoute");

const recipp_app = express();
const port = process.env.PORT || config.port;

const max_requests = 100;
const requests_duration = 15;

const limiter = rateLimit({
    windowMs: requests_duration * 60 * 1000,
    max: max_requests,
    message: "Too many requests, please try again later.",
    handler: (req, res) => {
        res.status(429).send(
            `You have exceeded the ${max_requests} request in ${requests_duration} ${
                requests_duration > 1 ? "minutes" : "minute"
            } limit!`
        );
    },
});

recipp_app.use(express.json());
recipp_app.use(limiter);
recipp_app.use(helmet());
recipp_app.use(morgan("dev"));
recipp_app.use(cors());

recipp_app.use("/api", indexRoutes);
recipp_app.use("/api", recipeRoutes);
recipp_app.use("/api", searchRoutes);

recipp_app.listen(port, () => {
    console.log(`RecippAPI running at: http://localhost:${port}`);
});
