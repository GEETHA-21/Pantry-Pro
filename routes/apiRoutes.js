var db = require("../models");
var axios = require("axios");


const API_KEY = "f00927d28fd14a4fa274e892d9a2af03";


const queryLoop = async function (list) {
    // console.log("list: ", list)
    var queryUrl =
        "https://api.spoonacular.com/recipes/" +
        list.toString() +
        "/information?includeNutrition=false&number=5&instructionsRequired=true&apiKey=" +
        API_KEY;
    // console.log(queryUrl)


    // axios.get(queryURL).then(function(res)){

    // }
    const result = await axios.get(queryUrl);

    console.log(queryUrl)
    if (result.data.analyzedInstructions.length > 0) {
        var ingredientsArray = []
        for (var k = 0; k < result.data.extendedIngredients.length; k++) {
            ingredientsArray.push(result.data.extendedIngredients[k].original)
        }

        for (var i = 0; i < result.data.analyzedInstructions.length; i++) {
            var objRecipe = {
                imageLink: result.data.image,
                recipeName: result.data.title,
                ingredients: [],
                steps: []

            }

            // console.log(result.data.analyzedInstructions[i].steps);

            for (j = 0; j < result.data.analyzedInstructions[i].steps.length; j++) {
                var objStep = {
                    stepNumber: 0,
                    stepText: ""
                }
                objStep.stepNumber = result.data.analyzedInstructions[i].steps[j].number;
                objStep.stepText = result.data.analyzedInstructions[i].steps[j].step;
                objRecipe.steps.push(objStep)
                objRecipe.ingredients.push(ingredientsArray)

            }

        }
        console.log(`Ingredients: ${objRecipe.ingredients}`)
        // console.log("inside the loop", objRecipe)
        return objRecipe
    }
}



// const getObj = util.promisify(queryLoop)

var globalArray = [];

module.exports = function (app) {
    // Get all examples
    app.get("/", function (req, res) {
        res.render("index")

    });
    app.get("/recipes", function (req, res) {
        res.render("recipes", globalArray);

    });

    app.post("/api/recipes", function (req, res) {
        var list = req.body;
        for (key in list) {
            list = list[key]
        }
        // console.log(`list array: ${list.length}`);
        async function prepareObj(list) {
            try {
                var hbsobj = {
                    recipes: []
                }

                for (var i = 0; i < list.length; i++) {
                    // console.log('inside of loop');
                    const objRecipe = await queryLoop(list[i]);
                    // console.log("moter fucking test: ", objRecipe)
                    hbsobj.recipes.push(objRecipe)

                }


                // console.log("hbsobj", hbsobj)
                globalArray = hbsobj;
                console.log(globalArray)

                res.redirect("/recipes");


            } catch (err) {
                console.log(err)
            }
        }
        prepareObj(list)
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
