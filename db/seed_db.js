var mongoose = require("./connection.js");
var seeds   = require("./seeds.json");

var Event = mongoose.model("Events");

console.log("I am seeding the database for you...")

Event.remove({}).then(function(){
  Event.collection.insert(seeds).then(function(){
    process.exit();
  });
});
