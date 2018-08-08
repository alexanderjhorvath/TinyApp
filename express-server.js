var express = require("express");
var app = express();
var PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let id = req.params.id;
  let templateVars = { shortURL: id, longURL: urlDatabase[id] };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
  // let shortURL = req.params.shortURL;
  let longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  var shortURLKey = generateRandomString();
  urlDatabase[shortURLKey] = req.body.longURL;
  console.log(urlDatabase);
  res.send("Ok");
});

function generateRandomString() {
  return Math.floor((1 + Math.random()) * 0x100000000).toString(36).substring(1);
}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

