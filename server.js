require("dotenv").config();
let express = require("express");
let exphbs = require("express-handlebars");
let session = require("express-session");
let passport = require("passport");
let flash = require("connect-flash");

let db = require("./models");

let app = express();
let PORT = process.env.PORT || 3000;
let sessionStore = new session.MemoryStore;

console.log("Hi");

// Middleware
app.use(session({
  cookie: { maxAge: 60000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

// Might not be needed
app.use(flash());
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
app.use(require(".routes/apiRoutes.js"));
app.use(require(".routes/htmlRoutes.js"))

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
