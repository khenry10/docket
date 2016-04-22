// ::start:: dependencies
var express  = require("express");
var mongoose = require("./db/connection.js");
var hbs      = require("express-handlebars")
var app      = express();
//  ::end:: dependencies
var Events   = mongoose.model("Events");
var Dates    = require("./calendar.js")

app.use("/assets", express.static("public"));


app.set("view engine", "hbs");
app.engine(".hbs", hbs({
  extname:       ".hbs",
  partialsDir:   "views/",
  layoutsDir:    "views/",
  defaultLayout: "layout-main"
}));

// app.get('/', function(req, res){
//   Events.find().then(function(events){
//     res.render("events-index", {
//       events
//     });
//   });
// });

app.get('/', function(req, res){
    res.render("events-index", {
        Dates
    });
});

app.listen(3002, function(){
  console.log("::::::::::::: You have turned me on.  I am alive... :::::::::::::")
})
