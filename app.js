require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const morgan = require("morgan");

const port = process.env.PORT || 4000;

// Middleware setup
app.use(
  morgan(
    "[:date[iso]] :method :url :status :response-time ms - :res[content-length]"
  )
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "this is my secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Flash messages setup
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.errors = req.flash("errors");
  next();
});

// Routes
const routes = [
  { path: "/", router: require("./routers/login") },
  { path: "/index", router: require("./routers/index") },
  { path: "/online_shopping", router: require("./routers/online_shopping") },
  { path: "/users", router: require("./routers/users") },
  { path: "/settings", router: require("./routers/settings") },
  { path: "/shipping", router: require("./routers/shipping") },
  { path: "/pickup", router: require("./routers/pickup") },
  { path: "/consolidated", router: require("./routers/consolidated") },
  { path: "/transactions", router: require("./routers/transactions") },
  { path: "/report", router: require("./routers/report") },
];

routes.forEach((route) => {
  app.use(route.path, route.router);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
