require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const port = 5000 || process.env.PORT;
const session = require("express-session");
const MongoStore = require("connect-mongo");

const db = require("./server/config/db.js");
const User = require("./server/models/User.js");
const passport = require("passport");

// trust first proxy
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat", // * sign and encrypt session information.
    resave: false, // * lưu lại: false
    saveUninitialized: true, // * cho phép lưu phiên
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

db.connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ! static files
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "/public")));

// ! Template Engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// ! Routes
app.use("/", require("./server/routes/auth.js"));
app.use("/", require("./server/routes/index.js"));
app.use("/", require("./server/routes/dashboard.js"));

// handle 404
app.get("*", function (req, res) {
  // res.status(404).render("404 Page Not found.");
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
