const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const MongoDBSession = require("connect-mongodb-session")(session);
const mongoURI =
  "mongodb+srv://Database_Admin:6MsfSDA3bNlhDtR0@cluster0.yrej5th.mongodb.net/?retryWrites=true&w=majority";
const PORT = 3000;
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then((res) => {
    // if (res) console.log(res);
    console.log("mongoDB connected ");
  });
const store = new MongoDBSession({
  uri: mongoURI,
  collection: "mySessions",
});
app.use(express.static("views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(
  session({
    secret: "!_@_#_$_%_***_my_Secret_Code_***_###_$_#_@_!",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000000000 },
  })
);

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else res.redirect("/login");
};

/**
 * End points ---->
 */
app.get("/", (req, res) => {
  console.log(req.url);
  res.render("home", { name: "Gopal Sasmal" });
});

app.get("/sess", (req, res) => {
  req.session.isAuth = true;
  console.log(req.session);
  console.log(req.session.id);
  res.send("This is home page");
});

app.get("/login", (req, res) => {
  console.log(req.url);
  res.render("login");
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.redirect("/login");
  } else {
    let passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) return res.redirect("/login");
    req.session.isAuth = true;
    res.redirect("/dashboard");
  }
});

app.get("/register", (req, res) => {
  console.log(req.url);
  res.render("register");
});

app.post("/register", async (req, res) => {
  console.log(req.url, "Post request");
  const { username, email, password } = req.body;
  console.log(email);
  let user = await UserModel.findOne({ email });
  if (user) {
    //console.log("User already exists");
    return res.redirect("/register");
  }
  const hashedPass = await bcrypt.hash(password, 12);
  user = new UserModel({
    username,
    email,
    password: hashedPass,
  });
  await user.save();
  res.redirect("/login");
});

app.get("/dashboard", isAuth, (req, res) => {
  console.log(req.url);
  res.render("dashboard");
});

app.get("/logout", (req, res) => {
  console.log(req.url);
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server connected on http://localhost:${PORT}`);
});
