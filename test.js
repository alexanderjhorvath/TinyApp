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

var email = "user@example.com";

var results = 0;

function verifyAccount(newEmail) {
  console.log("new email: " + newEmail);
Object.keys(users).forEach(function(key) {
  if (users[key] == newEmail) {
      return false;
    } else {
      return true;
    }
  });
}

console.log(verifyAccount(email));