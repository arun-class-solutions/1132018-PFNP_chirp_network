//Require modules and models

var express = require("express");
var models = require("./models/index");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();

//Set view engine

app.set("view engine", "ejs");

//Middleware

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(methodOverride("_method"));

app.get("/", function(req, res) {
    res.redirect(301, "/chirps");
});

//Get all chirps
app.get("/chirps", (req, res) => {
  // Note: Functionality inside here will run when a GET request is received to mysite.com/chirps
  // Step 1: Query database to retrieve all chirps
  // Step 2: Create HTML from chirp records
  // Step 3: Send completed HTML to browser
  models.Chirp.findAll().then((chirps) => {
    res.render("index", { chirps });
  });
  // Note: To view the site, navigate your browser to http://localhost:3000/chirps
});

//Create new chirp
app.post("/chirps", (req, res) => {
  // Step 1: Retrieve new chirp text from the form
  // Step 2: Create a new chirp entry in the database
  // Step 3: Redirect back to /chirps
  var chirpText = req.body;

  models.Chirp.create(chirpText).then(() => {
    res.redirect("/chirps");
  });
});

//Get specific chirp
app.get("/chirps/:id/edit", (req, res) => {
  // Step 1: Retrieve ID from the URL
  // Step 2: Query database for chirp via its ID
  // Step 3: Create the HTML for the edit page with the specific chirp in it
  // Step 4: Send the completed HTML to the browser
  var chirpId = req.params.id;

  models.Chirp.findById(chirpId).then((chirp) => {
    res.render("edit", { chirp });
  });
});

//Edit a chirp
app.put("/chirps/:id", (req, res) => {
  // Step 1: Retrieve updated text from the form
  // Step 2: Retrieve ID of chirp from the URL
  // Step 3: Query database for the specific chirp via its ID
  // Step 4: Perform database update of chirp record
  // Step 5: Redirect back to show all chirps
  var updatedChirpText = req.body;
  var chirpId = req.params.id;

  models.Chirp.findById(chirpId).then((chirp) => {
    chirp.updateAttributes(updatedChirpText).then(() => {
      res.redirect("/chirps");
    });
  });
});

//Delete a chirp
// Hint: .destroy() is the method to remove a chirp from the DB
app.delete("/chirps/:id", (req, res) => {
  // Step 1: Retrieve ID of specific chirp from the URL
  // Step 2: Query database for specific chirp
  // Step 3: Destroy chirp record
  // Step 4: Redirect back to /chirps
  var chirpId = req.params.id;

  models.Chirp.findById(chirpId).then((chirp) => {
    chirp.destroy().then(() => {
      res.redirect("/chirps");
    });
  });
});

app.listen(process.env.PORT || 3000);
