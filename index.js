// ::start:: dependencies
var express  = require("express");
var mongoose = require("./db/connection.js");
var hbs      = require("express-handlebars");
var parser   = require("body-parser");
var app      = express();
//  ::end:: dependencies
var Events   = mongoose.model("Events");

app.use("/assets", express.static("public"));

app.use(parser.urlencoded({extended: true}));
app.use(parser.json());

//boilerplate to use handlebars
app.set("view engine", "hbs");
app.engine(".hbs", hbs({
  extname:       ".hbs",
  partialsDir:   "views/",
  layoutsDir:    "views/",
  defaultLayout: "layout-main"
}));

// route that directs to event.hbs, which is where we bootstrap angular
app.get("/", function(req, res){
  res.render("event")
})

// all events endpoint
app.get('/api', function(req, res){
  Events.find().then(function(events){
    res.json(events)
  });
});

// creates event
app.post("/api", function(req, res){
  console.log(req.body)
  Events.create({name: req.body.name}).then(function(){
    res.redirect("/")

  })
})

app.listen(3002, function(){
  console.log("::::::::::::: You have turned me on.  I am alive... :::::::::::::")
})
