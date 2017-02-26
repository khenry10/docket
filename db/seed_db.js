var mongoose     = require("./connection.js");
var eventSeeds   = require("./seeds/eventSeeds.json");
var expenseSeeds = require("./seeds/expenseSeeds.json");
var todoSeeds = require("./seeds/todoSeeds.json");

var Event = mongoose.model("Events");
var Expenses = mongoose.model("Expenses");
var Todo = mongoose.model("Todo")

console.log("I am seeding the database for you...")

Todo.remove({}).then(function(){
  // Todo.collection.insert(todoSeeds).then(function(){
  //   process.exit();
  // });
});

Event.remove({}).then(function(){
  Event.collection.insert(eventSeeds).then(function(){
    process.exit();
  });
});

Expenses.remove({}).then(function(){
  Expenses.collection.insert(expenseSeeds).then(function(){
    process.exit();
  });
});
