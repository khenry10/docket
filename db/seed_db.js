var mongoose     = require("./connection.js");
var eventSeeds   = require("./eventSeeds.json");
var exepnseSeeds = require("./expenseSeeds.json")

var Event = mongoose.model("Events");

// var Expenses = mongoose.model("Expenses")

console.log("I am seeding the database for you...")

Event.remove({}).then(function(){
  Event.collection.insert(eventSeeds).then(function(){
    process.exit();
  });
});

// Expenses.remove({}).then(function(){
//   Expenses.collection.insert(expenseSeeds).then(function(){
//     process.exit();
//   });
// });
