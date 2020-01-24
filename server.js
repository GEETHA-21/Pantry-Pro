<<<<<<< HEAD
// eslint-disable-next-line no-undef
=======
>>>>>>> 6c71d20967f1cc02d3a564d1fb0981a1a63f3fa2
require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

<<<<<<< HEAD
const session = require("express-session");
const flash = require("connect-flash");
=======
console.log("Hi");
>>>>>>> 6c71d20967f1cc02d3a564d1fb0981a1a63f3fa2

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
<<<<<<< HEAD

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Express-session middleware
app.use(session({
    secret: "wolves",
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// Passport config middleware
const passport = require("passport");
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Express-flash middleware
app.use(flash());

// Variables to be used across the app for flash messages
// Web-page layout is set in partials/msg.handebars and
// partials/errors to be displayed at top of a page
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});


// Routes for users
// --> middleware should come before other routes
const userSession = require("./routes/users");
const userRoutes = require("./routes/userRoutes");
app.use("/users", userSession);
app.use("/users", userRoutes);

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

=======
console.log("After app.use statements");
// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
console.log("After app set");
// Routes
app.use(require("./routes/userRoutes.js"));
console.log("After userRoutes");
app.use(require("./routes/users.js"));
console.log("After users");
app.use(require("./routes/usersAuthHelper.js"));
console.log("After usersAuthHelper");
>>>>>>> 6c71d20967f1cc02d3a564d1fb0981a1a63f3fa2

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
<<<<<<< HEAD
    syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
    // Load mock data
    if (process.argv[2]) {
        const loadData = require(process.argv[2]);
        loadData();
    }

    app.listen(PORT, function () {
        console.log(
            "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
            PORT,
            PORT
        );
    });
=======
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
>>>>>>> 6c71d20967f1cc02d3a564d1fb0981a1a63f3fa2
});

module.exports = app;
