//
// Products Schema Model
//

// eslint-disable-next-line no-undef
module.exports = function (sequelize, DataTypes) {
	var Products = sequelize.define("Products", {
		name: DataTypes.STRING,
		calories: DataTypes.INTEGER
	});

	return Products;
};
