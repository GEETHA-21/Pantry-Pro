var db = require("../models");
const ensureAuthenticated = require("./usersAuthHelper");
const fixRecipeImage = require("./recipeImage");

module.exports = function (app) {
	// Load index page
	app.get("/", function (req, res) {
		db.Recipes.findAll({
			order: [
				["rating", "DESC"]
			],
			limit: 6
		}).then(function (recipes) {
			console.log(JSON.stringify(recipes));
			res.status(200).render("index", {
				msg: "Welcome!!",
				recipes: recipes.map(recipe => fixRecipeImage(recipe))
			});
		});
	});


	// Load example page and pass in an example by id
	app.get("/recipes/:id", function (req, res) {
		db.Recipes.findByPk(req.params.id).then(function (recipe) {
			if (recipe === null) {
				res.status(404).send("Not Found");
				return;
			}

			// Sequelize provides getProducts() function, when we build associations 
			recipe.getProducts().then(function (products) {
				if (recipe) {
					recipe.imageSrc = (recipe.image)
						? `data:image/jpeg;base64, ${recipe.image.toString("base64")}`
						: recipe.imageURL;
					recipe.image = null;
					recipe.imageURL = null;
					// Total Calories
					var total = 0;
					products.forEach(product => {
						total += product.calories * product.Ingredients.amount;
					});
					res.render("recipe", {
						recipe: recipe,
						products: products,
						totalCalories: total
					});
				} else {
					res.render("404");
				}
			});
		});
	});

	// Load Recipe Post page
	app.get("/post", function (req, res) {
		res.render("post");
	});

	// Load Advanced Search Page
	app.get("/search", function (req, res) {
		res.render("search");
	});

	app.post("/search", function (req, res) {
		res.render("search", req.body);
	});

	// Render 404 page for any unmatched routes
	app.get("*", function (req, res) {
		res.render("404");
	});
};
