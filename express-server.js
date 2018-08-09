var express = require("express");
var app = express();
var PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID" : {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/register", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("register", templateVars);
})

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
})

app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.sendStatus(400);
  } else {
    let userID = generateRandomString();
    createUser(userID, req.body.email, req.body.password)
    console.log("Users: " + JSON.stringify(users));
    res.cookie("user_id", userID);
    res.redirect("/urls");
  }
})

app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  var shortURLKey = generateRandomString();
  urlDatabase[shortURLKey] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  // console.log(req.params.id);
  deleteURL(req.params.id);
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  updateURL(req.params.id, req.body.longURL);
  res.redirect("/urls");
});

function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x100000000).toString(36).substring(1);
}

function deleteURL(id) {
  delete urlDatabase[id];
}

function updateURL(id, newURL) {
  deleteURL(id);
  urlDatabase[id] = newURL;
}

function createUser(id, email, password) {
  users[id] = {id: id, email: email, password: password};
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
