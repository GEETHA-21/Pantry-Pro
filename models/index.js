"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var db = {};

require("dotenv").config();

// * * * * * * * * *
// *** This section probably needs to be disabled for heroku **
const mysql = require("mysql2");
const connection = mysql.createConnection({
	host: config.host,
	// port: 3306,
	user: config.username,
	password: process.env.PASSWORD,
});
connection.execute(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
// * * * * * * * * *

if (config.use_env_variable) {
	var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
	var sequelize = new Sequelize(
		config.database,
		config.username,
		config.password = process.env.PASSWORD,
		config
	);
}

// Load models into sequialize
fs.readdirSync(__dirname)
	.filter(function (file) {
		return (
			file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
		);
	})
	.forEach(function (file) {
		var model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

// UserProfile makes use of "associate" now
Object.keys(db).forEach(function (modelName) {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

// Now, when we have all models ready we can
// build associations
db["Products"].belongsToMany(db["Recipes"], { through: db["Ingredients"] });
db["Recipes"].belongsToMany(db["Products"], { through: db["Ingredients"] });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
