const express = require("express");
const { Op, literal } = require("sequelize");
const Recipe = require("../models/Recipe");

const config = require("../config/config");

const router = express.Router();

const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Route to search for recipes by title
 * @name GET /search
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.get("/search", async (req, res) => {
    const query = req.query.query;
    const amount = req.query.amount;
    const recipes = await Recipe.findAll({
        where: {
            title: {
                [Op.like]: `%${query}%`,
            },
        },
        limit: amount ? parseInt(amount, 10) : config.recipe_amount,
    });
    res.json(recipes);
});

/**
 * Route to perform a complex search on recipes
 * @name GET /complexSearch
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.get("/complexSearch", async (req, res) => {
    const {
        title,
        cuisine,
        excludedCuisine,
        diets,
        intolerances,
        equipment,
        ingredients,
        excludedIngredients,
        type,
        maxReadyInTime,
        maxCookingTime,
        maxPreparationTime,
        minServings,
        maxServings,
        minCalories,
        maxCalories,
        minFat,
        maxFat,
        minCarbs,
        maxCarbs,
        minProtein,
        maxProtein,
        amount,
    } = req.query;

    const whereConditions = [];

    if (title) {
        whereConditions.push({
            title: {
                [Op.like]: `%${title}%`,
            },
        });
    }

    if (cuisine) {
        whereConditions.push({
            cuisine: {
                [Op.like]: `%${cuisine}%`,
            },
        });
    }

    if (excludedCuisine) {
        whereConditions.push({
            cuisine: {
                [Op.notLike]: `%${excludedCuisine}%`,
            },
        });
    }

    if (diets) {
        const dietsArray = Array.isArray(diets)
            ? diets
            : diets.split(",").map((d) => d.trim().toLowerCase());
        dietsArray.forEach((diet) => {
            whereConditions.push(
                literal(
                    `EXISTS (SELECT 1 FROM json_each(diets) WHERE json_each.value LIKE '%${diet}%')`
                )
            );
        });
    }

    if (intolerances) {
        const intolerancesArray = Array.isArray(intolerances)
            ? intolerances
            : intolerances.split(",").map((i) => i.trim().toLowerCase());
        intolerancesArray.forEach((intolerance) => {
            whereConditions.push(
                literal(
                    `EXISTS (SELECT 1 FROM json_each(intolerances) WHERE json_each.value LIKE '%${intolerance}%')`
                )
            );
        });
    }

    if (equipment) {
        const equipmentArray = Array.isArray(equipment)
            ? equipment
            : equipment.split(",").map((e) => e.trim().toLowerCase());
        equipmentArray.forEach((equip) => {
            whereConditions.push(
                literal(
                    `EXISTS (SELECT 1 FROM json_each(equipment) WHERE json_each.value LIKE '%${equip}%')`
                )
            );
        });
    }

    if (ingredients) {
        const ingredientsArray = Array.isArray(ingredients)
            ? ingredients
            : ingredients.split(",").map((ing) => ing.trim().toLowerCase());
        ingredientsArray.forEach((ingredient) => {
            whereConditions.push(
                literal(
                    `EXISTS (SELECT 1 FROM json_each(ingredients) WHERE json_each.value LIKE '%${ingredient}%')`
                )
            );
        });
    }

    if (excludedIngredients) {
        const excludedArray = Array.isArray(excludedIngredients)
            ? excludedIngredients
            : excludedIngredients
                  .split(",")
                  .map((ex) => ex.trim().toLowerCase());
        excludedArray.forEach((excluded) => {
            whereConditions.push(
                literal(
                    `NOT EXISTS (SELECT 1 FROM json_each(ingredients) WHERE json_each.value LIKE '%${excluded}%')`
                )
            );
        });
    }

    if (type) {
        whereConditions.push({
            type: {
                [Op.like]: `%${type}%`,
            },
        });
    }

    if (maxReadyInTime) {
        whereConditions.push({
            readyInTime: {
                [Op.lte]: maxReadyInTime,
            },
        });
    }

    if (maxCookingTime) {
        whereConditions.push({
            cookingTime: {
                [Op.lte]: maxCookingTime,
            },
        });
    }

    if (maxPreparationTime) {
        whereConditions.push({
            preparationTime: {
                [Op.lte]: maxPreparationTime,
            },
        });
    }

    if (minServings) {
        whereConditions.push({
            servingSize: {
                [Op.gte]: minServings,
            },
        });
    }

    if (maxServings) {
        whereConditions.push({
            servingSize: {
                [Op.lte]: maxServings,
            },
        });
    }

    if (
        minCalories ||
        maxCalories ||
        minFat ||
        maxFat ||
        minCarbs ||
        maxCarbs ||
        minProtein ||
        maxProtein
    ) {
        const nutritionConditions = [];

        if (minCalories) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.calories.amount') >= ${minCalories})`
                )
            );
        }
        if (maxCalories) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.calories.amount') <= ${maxCalories})`
                )
            );
        }
        if (minFat) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.fat.amount') >= ${minFat})`
                )
            );
        }
        if (maxFat) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.fat.amount') <= ${maxFat})`
                )
            );
        }
        if (minCarbs) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.carbs.amount') >= ${minCarbs})`
                )
            );
        }
        if (maxCarbs) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.carbs.amount') <= ${maxCarbs})`
                )
            );
        }
        if (minProtein) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.protein.amount') >= ${minProtein})`
                )
            );
        }
        if (maxProtein) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.protein.amount') <= ${maxProtein})`
                )
            );
        }

        if (nutritionConditions.length > 0) {
            whereConditions.push({
                [Op.and]: nutritionConditions,
            });
        }
    }

    try {
        const recipes = await Recipe.findAll({
            where: {
                [Op.and]: whereConditions,
            },
            limit: amount ? parseInt(amount, 10) : config.recipe_amount,
        });

        res.json(recipes);
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({
            error: "An error occurred while performing the search.",
        });
    }
});

/**
 * Route to search for recipes by ingredients
 * @name GET /searchByIngredients
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.get("/searchByIngredients", async (req, res) => {
    const ingredients = req.query.ingredients;
    const amount = req.query.amount;

    if (!ingredients) {
        return res
            .status(400)
            .json({ message: "Ingredients query parameter is required" });
    }

    const ingredientArray = ingredients
        .split(",")
        .map((ing) => ing.trim().toLowerCase());
    const matchAll = req.query.matchAll === "true" ? true : false;

    try {
        if (matchAll) {
            const recipes = await Recipe.findAll({
                where: {
                    [Op.and]: ingredientArray.map((ingredient) => {
                        return literal(
                            `EXISTS (SELECT 1 FROM json_each(ingredients) WHERE json_each.value LIKE '%${ingredient}%')`
                        );
                    }),
                },
                limit: amount ? parseInt(amount, 10) : config.recipe_amount,
            });

            res.json(recipes);
        } else {
            const recipes = await Recipe.findAll({
                where: {
                    [Op.or]: ingredientArray.map((ingredient) => {
                        return literal(
                            `EXISTS (SELECT 1 FROM json_each(ingredients) WHERE json_each.value LIKE '%${ingredient}%')`
                        );
                    }),
                },
                limit: amount ? parseInt(amount, 10) : config.recipe_amount,
            });

            const response = recipes.map((recipe) => {
                const recipeIngredients = recipe.ingredients.map((ing) =>
                    ing.name.toLowerCase()
                );

                const missingIngredients = recipeIngredients.filter((ing) => {
                    return !ingredientArray.some((specifiedIng) =>
                        ing.includes(specifiedIng)
                    );
                });

                const extraIngredients = ingredientArray.filter((ing) => {
                    return !recipeIngredients.some((recipeIng) =>
                        recipeIng.includes(ing)
                    );
                });

                const updatedIngredients = recipe.ingredients.map((ing) => {
                    const similar = ingredientArray.find(
                        (specifiedIng) =>
                            ing.name.toLowerCase().includes(specifiedIng) &&
                            ing.name.toLowerCase() !== specifiedIng
                    );
                    return similar
                        ? {
                              ...ing,
                              name: capitalizeWords(ing.name),
                              replacement: capitalizeWords(similar),
                          }
                        : { ...ing, name: capitalizeWords(ing.name) };
                });

                return {
                    ...recipe.toJSON(),
                    ingredients: updatedIngredients,
                    missingIngredients: missingIngredients
                        .map(capitalizeWords)
                        .sort(),
                    extraIngredients: extraIngredients
                        .map(capitalizeWords)
                        .sort(),
                };
            });

            res.json(response);
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while searching for recipes",
            error: error.message,
        });
    }
});

/**
 * Route to search for recipes excluding certain ingredients
 * @name GET /searchByExcludedIngredients
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.get("/searchByExcludedIngredients", async (req, res) => {
    const ingredients = req.query.ingredients;
    const amount = req.query.amount;

    if (!ingredients) {
        return res
            .status(400)
            .json({ message: "Ingredients query parameter is required" });
    }

    const ingredientArray = ingredients
        .split(",")
        .map((ing) => ing.trim().toLowerCase());

    const recipes = await Recipe.findAll({
        where: {
            [Op.and]: ingredientArray.map((ingredient) => {
                return literal(
                    `NOT EXISTS (SELECT 1 FROM json_each(ingredients) WHERE json_each.value LIKE '%${ingredient}%')`
                );
            }),
        },
        limit: amount ? parseInt(amount, 10) : config.recipe_amount,
    });

    res.json(recipes);
});

/**
 * Route to search for recipes by nutrients
 * @name GET /searchByNutrients
 * @function
 * @memberof module:recipp_app
 * @inner
 * @async
 * @param {object} req Express request object
 * @param {object} res Express response object
 */
router.get("/searchByNutrients", async (req, res) => {
    const {
        minCalories,
        maxCalories,
        minFat,
        maxFat,
        minCarbs,
        maxCarbs,
        minProtein,
        maxProtein,
        amount,
    } = req.query;

    const nutritionConditions = [];

    if (
        minCalories ||
        maxCalories ||
        minFat ||
        maxFat ||
        minCarbs ||
        maxCarbs ||
        minProtein ||
        maxProtein
    ) {
        if (minCalories) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.calories.amount') >= ${minCalories})`
                )
            );
        }
        if (maxCalories) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.calories.amount') <= ${maxCalories})`
                )
            );
        }
        if (minFat) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.fat.amount') >= ${minFat})`
                )
            );
        }
        if (maxFat) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.fat.amount') <= ${maxFat})`
                )
            );
        }
        if (minCarbs) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.carbs.amount') >= ${minCarbs})`
                )
            );
        }
        if (maxCarbs) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.carbs.amount') <= ${maxCarbs})`
                )
            );
        }
        if (minProtein) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.protein.amount') >= ${minProtein})`
                )
            );
        }
        if (maxProtein) {
            nutritionConditions.push(
                literal(
                    `(json_extract(nutrition, '$.protein.amount') <= ${maxProtein})`
                )
            );
        }
    }

    try {
        const recipes = await Recipe.findAll({
            where: {
                [Op.and]: nutritionConditions,
            },
            limit: amount ? parseInt(amount, 10) : config.recipe_amount,
        });

        res.json(recipes);
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).json({
            error: "An error occurred while performing the search.",
        });
    }
});

module.exports = router;
