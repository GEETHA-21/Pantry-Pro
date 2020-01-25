//
// Routes for logged in users
//

// Bring in express and database models
const express = require("express");
const router = express.Router();
const db = require("../models");
const Op = db.Sequelize.Op;
const ensureAuthenticated = require("./usersAuthHelper");
// const fixRecipeImage = require("./recipeImage");

// Gateway route for a user's page area
// this route is NOT protected
// router.get("/index", (req, res) => {
//   if (req.user) res.redirect("/users/" + req.user.id);
//   else res.redirect("/users/login");
// });

router.get("/", (req, res) => {
    res.render("index");
});

// User's personalized page route
router.get("/:id", ensureAuthenticated, (req, res) => {
  getUserData(req.user.id, userData => {
    // Do not show recommendation if user has favorites
    if (userData.favorites && userData.favorites.length > 0) {
      userData.recommend = null;
    }

    res.render("users/index", {
      recipes: userData
    });
  });
});

// Mark a recipe as favorite
router.put("/favorite/:recipeId", function(req, res) {
  console.log(`userid: ${req.user.id}, recipeid: ${req.params.recipeId}`);
  db.UserProfile.findOrCreate({
    where: {
      UserId: req.user.id,
      RecipeId: req.params.recipeId
    },
    defaults: {
      favorite: true
    }
  })
    .spread((userInfo, created) => {
      if (created) {
        req.flash("success_msg", "The recipe has been added to favorites.");
      } else {
        db.UserProfile.update(
          {
            favorite: true
          },
          {
            where: {
              UserId: req.user.id,
              RecipeId: req.params.recipeId
            }
          }
        )
          .then(userInfo => {
            req.flash("success_msg", "The recipe has been marked as favorite.");
            res.json(userInfo);
            return;
          })
          .catch(err => {
            req.flash("error_msg", "Unable to mark the recipe as favorite.");
            res.json(err);
            return;
          });
        req.flash("success_msg", "The recipe has been marked as favorite.");
        res.json(userInfo);
      }
      console.log("favorite set ok");
      return;
    })
    .catch(err => {
      console.log(err);
      req.flash("error_msg", "Failed to add. User and/or recipe not found.");
      res.json(err);
      return;
    });
});

// Mark a recipe as "posted" by the user
// router.post("/posted/:recipeId", ensureAuthenticated, function (req, res) {
router.post("/posted/:recipeId", function(req, res, next) {
  if (!req.user) res.end("Unable to identify userId for recipe post");
  console.log(`userid: ${req.user.id}, recipeid: ${req.params.recipeId}`);

  db.UserProfile.findOrCreate({
    where: {
      UserId: req.user.id,
      RecipeId: req.params.recipeId
    },
    defaults: {
      posted: true
    }
  })
    .spread((userInfo, created) => {
      if (created) {
        req.flash("success_msg", "The recipe has been posted.");
        return;
      } else {
        db.UserProfile.update(
          {
            posted: true
          },
          {
            where: {
              UserId: req.user.id,
              RecipeId: req.params.recipeId
            }
          }
        )
          .then(userInfo => {
            req.flash("success_msg", "The recipe has been marked as posted.");
            return;
          })
          .catch(err => {
            req.flash("error_msg", "Unable to mark the recipe as posted.");
            return;
          });
      }
    })
    .catch(err => {
      console.log(err);
      req.flash("error_msg", "Failed to add. User and/or recipe not found.");
      return;
    });
});

/*
---------------------------------------------------------------------------
 Helper functions
---------------------------------------------------------------------------
*/

//
// Collect user's favorites and own posted recipes
// by starting queries asynchronously
//
// PARAMS:
// * userId = the user ID
// * cbackFunc = callback function to call against the result
//
async function getUserData(userId, cbackFunc) {
  const recommend = getRecommendedRecipes(5);
  const posted = getAllRecipesByUser(userId);
  const favorites = getAllUserFavorites(userId);
  const userData = {
    recommend: await recommend,
    posted: await posted,
    favorites: await favorites
  };

  cbackFunc(userData);
}

//
// Find the user's login info by user's ID
//
function userInfoById(userId) {
  return new Promise((resolve, reject) => {
    db.User.findByPk(userId)
      .then(user => {
        console.log(`Found user info for [${userId}] ${user}`);
        resolve(user);
      })
      .catch(err => {
        reject(err);
      });
  });
}

//
// Find all recipes by the user
//
// PARAMS:
// * userId = the user ID
// RETURN:
// * Promise instance
//
function getAllRecipesByUser(userId) {
  console.log(`Finding all recipes by userId[${userId}]`);

  return new Promise((resolve, reject) => {
    db.UserProfile.findAll({
      where: {
        UserId: userId,
        posted: true
      }
    })
      .then(items => {
        if (!items || items.length === 0) resolve(null);
        db.Recipes.findAll({
          where: {
            id: {
              [Op.in]: items.map(recipe => recipe.RecipeId)
            }
          }
        })
          .then(recipes => {
            // console.log(`Found all recipes by userId[${userId}] ${JSON.stringify(recipes)}`);
            recipes.forEach(recipe => {
              fixRecipeImage(recipe);
            });

            resolve(recipes);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}

//
// Retrieve user's favorite recipes
//
// PARAMS:
// * userId = the user ID
// RETURN:
// * Promise instance
//
function getAllUserFavorites(userId) {
  console.log(`Finding all favorite recipes of userId[${userId}]`);

  return new Promise((resolve, reject) => {
    db.UserProfile.findAll({
      where: {
        UserId: userId,
        favorite: true
      }
    })
      .then(items => {
        if (!items || items.length === 0) resolve(null);
        db.Recipes.findAll({
          where: {
            id: {
              [Op.in]: items.map(recipe => recipe.RecipeId)
            }
          }
        })
          .then(recipes => {
            recipes.forEach(recipe => {
              fixRecipeImage(recipe);
            });

            resolve(recipes);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}

//
// find random recipes
//
// PARAMS:
// * num = the maximum number of recipes
// RETURN:
// * Promise instance
//
function getRecipes(num = 5) {
  console.log(`Finding ${num} recipes`);

  return new Promise((resolve, reject) => {
    db.Recipes.findAll({
      limit: num
    })
      .then(recipes => {
        console.log(`Found ${recipes.length} recipes`);
        if (!recipes || recipes.length === 0) {
          recipes = null;
        } else {
          recipes.forEach(recipe => {
            fixRecipeImage(recipe);
          });
        }

        resolve(recipes);
      })
      .catch(err => reject(err));
  });
}

//
// find top 5 recipes
//
// PARAMS:
// * num = the maximum number of recipes
// RETURN:
// * Promise instance
//
//  NOTE:
//  SQL is super simple but quite difficult w/ Sequelize(ORM)
//  to sort by the aggregated new field name
//
//  SELECT recipeid, sum(favorite) AS fav
//  FROM userprofiles
//  GROUP BY recipeid
//  ORDER BY fav DESC
//  LIMIT 5
//  ;
//
function getRecommendedRecipes(num = 5) {
  console.log(`Finding ${num} recommended recipes`);

  return new Promise((resolve, reject) => {
    db.UserProfile.findAll({
      attributes: [
        "RecipeId",
        [db.sequelize.fn("sum", db.sequelize.col("favorite")), "fav"]
      ],
      group: "RecipeId",
      // order: 'fav DESC',
      limit: num
    })
      .then(recipes => {
        console.log(`Found ${recipes.length} recipe recomendations`);
        if (!recipes || recipes.length === 0) {
          recipes = null;
        } else {
          const recipeIds = recipes
            .sort((a, b) => b.fav - a.fav)
            .map(c => c.RecipeId);
          db.Recipes.findAll({
            where: {
              id: {
                [Op.in]: recipeIds
              }
            }
          })
            .then(recipes => {
              recipes.forEach(recipe => {
                fixRecipeImage(recipe);
              });
              resolve(recipes);
            })
            .catch(err => reject(err));
        }
      })
      .catch(err => reject(err));
  });
}

// Export the router
module.exports = router;
