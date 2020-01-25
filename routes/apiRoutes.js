var db = require("../models");
var multiparty = require("multiparty");
var fs = require("fs");
const Op = db.Sequelize.Op
const ensureAuthenticated = require("./usersAuthHelper");
const fixRecipeImage = require("./recipeImage");

module.exports = function (app) {
	// Get all Recipes
	app.get("/api/recipes", function (req, res) {
		db.Recipes.findAll({
			where: req.body
		}).then(function (recipes) {
			res.json(recipes);
		});
	});

	// Get Recipe details by recipe id 
	app.get("/api/recipes/:id", function (req, res) {
		db.Recipes.findByPk(req.params.id).then(function (dbRecipe) {
			if (dbRecipe === null) {
				res.status(404).send("Not Found");
			}

			// Sequelize provides getProducts() function, when we build associations 
			dbRecipe.getProducts().then(function (products) {
				var response = {
					recipe: dbRecipe,
					products: products
				};

				// TODO: Fix image vs imageURL as done in html route
				dbRecipe.image = dbRecipe.image.toString("base64");
				res.json(response);
			});
		});
	});

	// Create or Post a new recipe
	app.post("/api/recipes", function (req, res) {
		db.Recipes.create(req.body).then(function (recipe) {
			res.json(recipe.id);
		});
	});

	// Get all Products 
	app.get("/api/products", function (req, res) {
		db.Products.findAll({
			where: req.body
		}).then(function (products) {
			res.json(products);
		});
	});

	// Find/insert one product and return the id
	app.post("/api/products", function (req, res) {
		db.Products.findOrCreate({
			where: {
				name: req.body.name
			},
			defaults: req.body
		})
			.spread(function (product, created) {
				console.log(created);
				console.log(product.id)
				res.json(product.id)
			}).catch(err => {
				console.log()
			})
	});

	//
	// Post Ingredients for a recipe
	//	
	// Table: ingredients
	// Columns:
	//   amount int(11) 
	//   measurement varchar(255) 
	//   createdAt datetime     <-- auto 
	//   updatedAt datetime     <== auto
	//   ProductId int(11) PK   <== REQUIRED
	//   RecipeId int(11) PK    <== REQUIRED
	//
	app.post("/api/ingredient/:recipeid/:productid", function (req, res) {
		db.Ingredients.findOrCreate({
			where: {
				RecipeId: req.params.recipeid,
				ProductId: req.params.productid
			},
			defaults: req.body
		})
			.spread((ingr, created) => {
				console.log("Ingredient inserted successfully");
				return;
			}).catch(err => {
				console.log("Failed adding the ingredient ");
				return;
			});
	});

	// Delete a recipe by id
	app.delete("/api/recipes/:id", ensureAuthenticated, function (req, res) {
		db.Recipes.destroy({
			where: {
				id: req.params.id
			}
		}).then(function (recipe) {
			res.json(recipe);
		});
	});


	// ======================== Update recipe rating ===========================
	app.put("/api/recipes/:id/rating", function (req, res) {
		db.Recipes.findByPk(req.params.id).then(function (dbRecipe) {
			if (dbRecipe === null) {
				res.status(404).send("Not Found");
			}
			dbRecipe.update({
				rating: dbRecipe.rating + 1
			}).then(function (dbRecipeUpdated) {
				res.json(dbRecipeUpdated);
			});
		});
	});

	//================================Upload Image=================================
	app.put("/api/recipes/:id/image", function (req, res) {

		var form = new multiparty.Form();
		form.parse(req, function (err, fields, files) {
			if (err) {
				res.status(400).send("Bad User Input");
			}

			fs.readFile(files["image"][0].path, function (err, data) {
				db.Recipes.findByPk(req.params.id).then(function (dbRecipe) {
					if (dbRecipe === null) {
						res.status(404).send("Not Found");
					}
					dbRecipe.update({
						image: data
					}).then(function (dbRecipeUpdated) {
						res.json(dbRecipeUpdated.id);
					});
				});
			});
		});
	});

	// Searching Recipes
	app.get("/api/recipes", function (req, res) {
		db.Recipes.findAll({
			where: req.body
		}).then(function (recipes) {
			res.json(recipes);
		});
	});

	// Search recipe GET route w/ parameters
	// will render a page for the search result 
	app.get("/api/search/:recipes", function (req, res) {
		const searchCondition = {};  // for db.Recipes
		const productCondition = {}; // for db.Products
		const _params = req.params.recipes.split('&').map(kv => kv.split('='));
		const params = {};

		// params = Object.fromEntries(params);	
		// TypeError: Object.fromEntries is not a function --> not available in Node?
		_params.map(kv => params[kv[0]] = kv[1]);

		console.log("PARAMS", JSON.stringify(params));

		['mealType', 'gluten_free', 'dairy_free', 'vegetarian', 'vegan'].forEach(item => {
			if (params[item] === 'true') params[item] = true;
			if (params[item] === 'false') params[item] = false;
			if (item in params) searchCondition[item] = params[item];
		});

		if ("proteinType" in params) {
			searchCondition["name"] = { [Op.like]: `%${params["proteinType"]}%` };
			productCondition["name"] = { [Op.like]: `%${params["proteinType"]}%` };
		}
		if ("veggieType" in params) {
			searchCondition["name"] = { [Op.like]: `%${params["veggieType"]}%` };
			productCondition["name"] = { [Op.like]: `%${params["veggieType"]}%` };
		}

		db.Recipes.findAll({
			include: [{
				model: db.Products,
				where: productCondition,
				required: false
			}],
			where: searchCondition
		})
			.then(result => {
				// console.log(`Found ${result.count} recipe(s)`);
				// res.json(result);
				res.render("searchResults", {
					recipes: result.map(recipe => fixRecipeImage(recipe))
				});
			}).catch(err => console.log("Recipe search error", err));
	})
};

var axios = require("axios");

const API_KEY = "f00927d28fd14a4fa274e892d9a2af03";
module.exports = function (app) {
	// Get all examples
	app.post("/api/recipes", function (req, res) {
		var list = req.body;
		console.log(list);
		for (key in list) {
			list = list[key]
		}
		var hbsobj = {
			recipes: []
		}
		for (var i = 0; i < list.length; i++) {

			var queryUrl =
				"https://api.spoonacular.com/recipes/" +
				list[i].toString() +
				"/information?includeNutrition=false&number=5&instructionsRequired=true&apiKey=" +
				API_KEY;
			console.log(queryUrl)
			axios.get(queryUrl).then(function (result) {
				// var recipeIdArray = [

				// for (var i = 0; i < result.length; i++) {
				console.log(`Recipe name: ${result.data.title}`);
				//console.log(result.data);
				console.log(result.data.analyzedInstructions)
			});
		}
		//   recipeIdArray.push(result[i].id);
		// }
		// return result

		if (result.data.analyzedInstructions.length > 0) {
			var objRecipe = {
				recipeName: result.data.title,
				steps: []

			}
			for (var i = 0; i < result.data.analyzedInstructions.length; i++) {
				console.log(result.data.analyzedInstructions[i].steps);
				var objStep = {
					stepNumber: 0,
					stepText: ""
				}
				for (j = 0; j < result.data.analyzedInstructions[i].steps.length; j++) {
					objStep.stepNumber = result.data.analyzedInstructions[i].steps[j].number;
					objStep.stepText = result.data.analyzedInstructions[i].steps[j].step;

				}
				console.log(objStep)
				objRecipe.steps.push(objStep)
			}
		}
		// console.log(`${stepNumber}. ${stepText}`);

		//<div class="card" style="width: 18rem;">
		//   <img src="..." class="card-img-top" alt="...">
		//   <div class="card-body">
		//     <h5 class="card-title">Card title</h5>
		//     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
		//     <a href="#" class="btn btn-primary">Go somewhere</a>
		//   </div>
		// </div>
		hbsobj.recipes.push(objRecipe)
		console.log(hbsobj)
		res.render("recipes", hbsobj)


	});

	// Create a new example
	app.post("/api/examples", function (req, res) {
		db.Example.create(req.body).then(function (dbExample) {
			res.json(dbExample);
		});
	});

	// Delete an example by id
	app.delete("/api/examples/:id", function (req, res) {
		db.Example.destroy({ where: { id: req.params.id } }).then(function (
			dbExample
		) {
			res.json(dbExample);
		});
	});
};

