require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
<<<<<<< HEAD
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);
require("./routes/userRoutes")(app);
require("./routes/users")(app);
require("./routes/usersAuthHelper")(app);


=======
require("./routes/userRoutes.js")(app);
require("./routes/users.js")(app);
require("./routes/usersAuthHelper.js")(app);
>>>>>>> 122dd41628e380d62c893902aa473e56caa81bbb

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
