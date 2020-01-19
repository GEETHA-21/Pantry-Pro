//
// Recipes Schema Model
//

// eslint-disable-next-line no-undef
module.exports = function (sequelize, DataTypes) {
	var Recipes = sequelize.define("Recipes", {
		name: DataTypes.STRING,
		description: DataTypes.TEXT,
		mealType: DataTypes.STRING,
		image: DataTypes.BLOB("long"),
		imageURL: DataTypes.STRING,
		gluten_free: DataTypes.BOOLEAN,
		dairy_free: DataTypes.BOOLEAN,
		vegetarian: DataTypes.BOOLEAN,
		vegan: DataTypes.BOOLEAN,
		prep_time: DataTypes.INTEGER,
		cook_time: DataTypes.INTEGER,
		instructions: DataTypes.TEXT,
		rating: DataTypes.INTEGER
	});

	return Recipes;
};
