
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function deleteURL(id) {
  urlDatabase = urlDatabase.filter((test) => test.id !== id);
}

deleteURL(b2XVn2);
console.log(urlDatabase);