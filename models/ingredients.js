//
// Products Schema Model
//

// module.exports = function(sequelize, DataTypes) {
//     var Ingredients = sequelize.define("Ingredients", {
//         name: DataTypes.STRING,
//         amount: DataTypes.INTEGER
//     });

//     return Ingredients;
//   };

// module.exports = function(sequelize, DataTypes) {
//     var Ingredient = sequelize.define("Ingredient", {
//         id: DataTypes.INTEGER,
//         name: DataTypes.STRING,
//     });

//     return Ingredient;
//   };


// eslint-disable-next-line no-undef
module.exports = function (sequelize, DataTypes) {
	var Ingredients = sequelize.define("Ingredients", {
		amount: DataTypes.INTEGER,
		measurement: DataTypes.STRING
	});

	return Ingredients;
};

