require("dotenv").config();
const config = require("./config/config");

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const indexRoutes = require("./routes/indexRoute");
const recipeRoutes = require("./routes/recipesRoute");
const searchRoutes = require("./routes/searchRoute");

const recipp_app = express();
const port = process.env.PORT || config.port;

recipp_app.use(express.json());
recipp_app.use(morgan("dev"));
recipp_app.use(bodyParser.json());

recipp_app.use("/api", indexRoutes);
recipp_app.use("/api", recipeRoutes);
recipp_app.use("/api", searchRoutes);

recipp_app.listen(port, () => {
    console.log(`RecippAPI at: http://localhost:${port}`);
});
