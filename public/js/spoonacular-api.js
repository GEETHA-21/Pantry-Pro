const API_KEY = "f00927d28fd14a4fa274e892d9a2af03";

var ingredientList = [];
var items = ingredientList.map(ingredients => ingredients.toLowerCase());

$("#addToList").on("click", function (event) {
  $(".itemBox").empty();
  event.preventDefault();
  // console.log(items);
  var addItem = $("#addItem")
    .val()
    .trim();

  var item = addItem.toLowerCase();

  // dupItem = false;
  // check if array is empty
  // if empty, just push value to array

  // ingredientList.push(addItem);

  if (items.includes(item)) {
    alert("Button already created!");
    event.preventDefault();

    // document.getElementById("animal-form").requestFullscreen();
    // break;
  } else {
    // console.log(item);
    ingredientList.push(addItem);
    items.push(item);
    console.log(`ingredients input: ${ingredientList}`);
    console.log(`To lower Case: ${items}`);

    for (var i = 0; i < items.length; i++) {
      var itemTab = $("<div>");

      var removeButton = $("<button>")
        .addClass("remove")
        .text("x");
      var itemText = $("<p>").text(items[i]);

      itemTab.append(removeButton, itemText);
      $(".itemBox").append(itemTab);
    }
    // document.getElementById("animal-form").reset();
    // createButtons();
  }

  $("#addItem").val("");
});
// for (var i = 0; i < ingredientList.length; i++) {
// }
$("#enterList").on("click", function (event) {
  event.preventDefault();
  getRecipeIDs(ingredientList);
});

function getRecipeIDs(list) {



  var ingredients = list.toString();
  console.log(`Ingredients: ${ingredients}`);
  var queryUrl =
    "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" +
    ingredients +
    "&number=5&instructionsRequired=true&apiKey=" +
    API_KEY;

  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(
    function (result) {
      var recipeIdArray = [];
      for (var i = 0; i < result.length; i++) {
        console.log(`result: ${result[i].id}`);
        recipeIdArray.push(result[i].id);
      }
      // return result
      // getRecipeInfo(recipeIdArray);
      getRecipeServer(recipeIdArray);
      // console.log(`Query URL: ${queryUrl}`);
    },
    function (error) {
      console.log(error);
    }
  );
}
function getRecipeServer(list) {
  console.log(list);
  var obj = {
    "ids": list
  };
  console.log("obj", obj);
  $.post("/api/recipes", obj).then(function () {
    console.log("back");
  });
}

function getRecipeInfo(list) {
  for (var i = 0; i < list.length; i++) {
    var queryUrl =
      "https://api.spoonacular.com/recipes/" +
      list[i].toString() +
      "/information?includeNutrition=false&number=5&instructionsRequired=true&apiKey=" +
      API_KEY;

    $.ajax({
      url: queryUrl,
      method: "GET"
    }).then(
      function (result) {
        // var recipeIdArray = [

        // for (var i = 0; i < result.length; i++) {
        console.log(`Recipe name: ${result.title}`);
        console.log(result);
        //   recipeIdArray.push(result[i].id);
        // }
        // return result
        if (result.analyzedInstructions.length > 0) {
          for (var i = 0; i < result.analyzedInstructions.length; i++) {
            console.log(result.analyzedInstructions[i].steps);
            for (j = 0; j < result.analyzedInstructions[i].steps.length; j++) {
              var stepNumber = result.analyzedInstructions[i].steps[j].number;
              var stepText = result.analyzedInstructions[i].steps[j].step;

              // console.log(`${stepNumber}. ${stepText}`);

              //<div class="card" style="width: 18rem;">
              //   <img src="..." class="card-img-top" alt="...">
              //   <div class="card-body">
              //     <h5 class="card-title">Card title</h5>
              //     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              //     <a href="#" class="btn btn-primary">Go somewhere</a>
              //   </div>
              // </div>
            }
          }
          var cardDiv = $("<div>")
            .addClass("card")
            .attr("style", "width: 18rem;");
          var image = $("<img>")
            .attr("src", `${result.image}`)
            .addClass("card-img-top")
            .attr("alt", `${result.title}`);
          var contentDiv = $("<div>").addClass("card-body");
          var cardTitle = $("<h5>")
            .addClass("card-title")
            .text(`${result.title}`);
          var cardText = $("<p>")
            .addClass("card-text")
            .text(`Ready in ${result.readyInMinutes} minutes!`);
          var stepsButton = $("<a>")
            .attr("type", "button")
            .attr("id", "viewRecipeBtn")
            .addClass("btn btn-primary")
            .attr("data-toggle", "modal")
            .attr("data-target", "#recipeModal")
            .text("View Recipe");
          $(".card-box").append(
            cardDiv.append(image),
            contentDiv.append(cardTitle, cardText, stepsButton)
          );
          // console.log(result.analyzedInstructions);
          // console.log(`Query URL: ${queryUrl}`);
          $(document).on("click", "#viewRecipeBtn", function (event) {
            event.preventDefault();
            console.log(this);
            $("#recipeModal").modal("show");

            $("#modalTitle").text(`${result.name}`);
            $("#modalBody").text(`${stepNumber}. ${stepText}`);
          });
        }
      },
      function (error) {
        console.log(error);
      }
    );
  }

  //loop through array of ID's passed through
}

//make a function that creates an object of recipe information and render it through handlebars
