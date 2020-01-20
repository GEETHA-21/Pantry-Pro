var db = require("../models");
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
