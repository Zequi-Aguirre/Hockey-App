// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// error messages with flash

let flash = require("connect-flash");
app.use(flash());

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalized = require("./utils/capitalized");
const projectName = "Hockey-App";

app.locals.appTitle = `${projectName}`;

// =================== SESSION ==================================

const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(
  session({
    secret: "123secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000,
    }, // ADDED code below !!!
    store: MongoStore.create({
      // mongoUrl: `mongodb://localhost/${projectName}`,
      // mongoUrl: process.env.MONGODB_URI || `mongodb://localhost/${projectName}`,
      mongoUrl: process.env.MONGODB_URI,
      // mongoUrl: `mongodb://localhost/${projectName}`,
    }),
  })
);

app.use(function (req, res, next) {
  // im making a template variable called theUser and imequalling it to
  // the user object in the session
  res.locals.theUser = req.session.user;
  res.locals.errorMessage = req.flash("error");
  res.locals.successMessage = req.flash("success");
  next();
});

// =================== SESSION ==================================

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
const teamRoutes = require("./routes/team.routes");
const seasonRoutes = require("./routes/season.routes");
const playerRoutes = require("./routes/player.routes");
const gameRoutes = require("./routes/game.routes");
const adminRoutes = require("./routes/admin.routes");
app.use("/auth", authRoutes);
app.use("/team", teamRoutes);
app.use("/season", seasonRoutes);
app.use("/player", playerRoutes);
app.use("/game", gameRoutes);
app.use("/admin", adminRoutes);

// =-=--=-==-==-==-=-=-=-=--=-=-=-=

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
