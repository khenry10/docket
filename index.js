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

// thought I would need the below for show functionality but the below /api is working
// app.get('/api/:name', function(req, res){
//   console.log("app.get is being used")
//   Events.findOne({name: req.params.name}).then(function(event){
//     console.log(event)
//     res.json(event)
//   })
// })

// all events endpoint
app.get('/api', function(req, res){
  console.log('app.get /api is being used')
  console.log(req.params)
  Events.find().then(function(events){
    res.json(events)
    // console.log(events)
  });
});

// creates event
app.post("/api", function(req, res){
  console.log(req.body)
  Events.create(req.body).then(function(){
    res.redirect("/")
  })
})


app.put("/api/:name", function(req, res){
  Events.findOneAndUpdate({name: req.params.name}, req.body.event, {new: true}).then(function(event){
    res.json(event)
  })
})

app.delete("/api/:name",function(req, res){
  console.log(req.params.name)
  Events.findOneAndRemove({name: req.params.name}).then(function(){
    res.json({success: true})
  })
})

// route that directs to event.hbs, which is where we bootstrap angular
app.get("/*", function(req, res){
  res.render("event")
})

app.listen(3002, function(){
  console.log("::::::::::::: You have turned me on.  I am alive... :::::::::::::")
})
