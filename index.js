// ::start:: dependencies
var express  = require("express");
var mongoose = require("./db/connection.js");
var hbs      = require("express-handlebars");
var parser   = require("body-parser");
var app      = express();
//  ::end:: dependencies
var Events   = mongoose.model("Events");

app.use("/assets", express.static("public"));

//boilerplate to use body parser
app.use(parser.urlencoded({extended: true}));
// boilerplate for body-parser, need to when submiting data from angular since it utilizes ajax calls
app.use(parser.json());

//boilerplate to use handlebars
app.set("view engine", "hbs");
app.engine(".hbs", hbs({
  extname:       ".hbs",
  partialsDir:   "views/",
  layoutsDir:    "views/",
  defaultLayout: "layout-main"
}));


// all events endpoint
app.get('/api', function(req, res){
  console.log(req.body)
  Events.find().then(function(events){
    res.json(events)
    // console.log(events)
  });
});

// creates event
app.post("/api", function(req, res){
  Events.create(req.body).then(function(){
    res.redirect("/")

  })
})

app.get('/api/:name', function(req, res){
  console.log(req.params.name)
  Events.findOne({name: req.params.name}).then(function(event){
    console.log(event)
    res.json(event)
  })
})

// route that directs to event.hbs, which is where we bootstrap angular
app.get("/*", function(req, res){
  res.render("event")
})

app.listen(3002, function(){
  console.log("::::::::::::: You have turned me on.  I am alive... :::::::::::::")
})
