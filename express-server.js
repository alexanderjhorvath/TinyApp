var express = require("express");
var app = express();
var PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const bcrypt = require("bcrypt");

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": {
    originalURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    originalURL: "http://www.google.com",
    userID: "user2RandomID"
  }
};

const users = {
  "userRandomID" : {
    id: "userRandomID",
    email: "temp@temp.com",
    hashedPassword: "$2b$10$Znbzm5u0qXRXbdJtMX0w/udHu/YbFM0GWBuLS7JeliQcmU3HiQuke"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    hashedPassword: "$2b$10$Znbzm5u0qXRXbdJtMX0w/udHu/YbFM0GWBuLS7JeliQcmU3HiQuke"
  }
}

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/register", (req, res) => {
  let templateVars = { users: users[req.cookies.user_id] };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { users: users[req.cookies.user_id] };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  // console.log(users);
  if (req.body.email === "" || req.body.password === "") {
    res.sendStatus(400);
  }
  let user;
  for (let key in users) {
    if (users[key].email === req.body.email) {
    user = users[key].id;
    }
  }
  if (bcrypt.compareSync(req.body.password, users[user].hashedPassword) === true) {
    res.cookie("user_id", user);
    res.redirect("/urls");
  } else {
    res.sendStatus(403);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.sendStatus(400);
  }
  for (var key in users) {
    if (!users.hasOwnProperty(key)) continue;
    if (users[key].email === req.body.email) {
      res.sendStatus(400);
    }
  }
  let userID = generateRandomString();
  let hashedPassword = bcrypt.hashSync(req.body.password, 10);
  createUser(userID, req.body.email, hashedPassword);
  res.cookie("user_id", userID);
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  let templateVars = { users: users[req.cookies.user_id] };
  if (!req.cookies.user_id) {
    res.redirect("/register");
  } else {
    res.render("urls_new", templateVars);
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlsForUser(req.cookies.user_id), users: users[req.cookies.user_id] };
  // console.log(templateVars)
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id].originalURL, users: users[req.cookies.user_id] };
  if (req.cookies.user_id !== urlDatabase[req.params.id].userID) {
    res.sendStatus(403);
  } else {
    res.render("urls_show", templateVars);
  }
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].originalURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  var shortURLKey = generateRandomString();
  urlDatabase[shortURLKey] = {originalURL: req.body.longURL, userID: req.cookies.user_id};
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
  if (req.cookies.user_id === urlDatabase[req.params.id].userID) {
    deleteURL(req.params.id);
    res.redirect("/urls");
  } else {
    res.sendStatus(403);
  }
});

app.post("/urls/:id/update", (req, res) => {
  if (req.cookies.user_id === urlDatabase[req.params.id].userID) {
    updateURL(req.params.id, req.body.longURL, req.cookies.user_id);
    res.redirect("/urls");
  } else {
    res.sendStatus(403);
  }

});

function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x100000000).toString(36).substring(1);
}

function deleteURL(id) {
  delete urlDatabase[id];
}

function updateURL(id, newURL, userID) {
  deleteURL(id);
  urlDatabase[id] = {originalURL: newURL, userID: userID};
  // console.log(urlDatabase);
}

function createUser(id, email, password) {
  users[id] = {id: id, email: email, hashedPassword: password};
  // console.log(users);
}

function urlsForUser(id) {
  var filteredURLs = {};
  for (var key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      filteredURLs[key] = {
        longURL: urlDatabase[key].originalURL,
        shortURL: key,
        userID: id
      }
    }
  }
return filteredURLs;
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
