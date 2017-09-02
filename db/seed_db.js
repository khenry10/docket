var mongoose     = require("./connection.js");
var eventSeeds   = require("./seeds/eventSeeds.json");
var expenseSeeds = require("./seeds/expenseSeeds.json");
var todoSeeds = require("./seeds/todoSeeds.json");
var employmentSeeds = require("./seeds/employmentSeeds.json");

var Event = mongoose.model("Events");
var Budget = mongoose.model("Budget");
var Todo = mongoose.model("Todo")
var Employment = mongoose.model("Employment");

console.log("I am seeding the database for you...")

// Todo.remove({}).then(function(){
//   // Todo.collection.insert(todoSeeds).then(function(){
//   //   process.exit();
//   // });
// });

Employment.remove({}).then(function(){
  Employment.collection.insert(employmentSeeds).then(function(){
    process.exit()
  })
});

Event.remove({}).then(function(){
  Event.collection.insert(eventSeeds).then(function(){
    process.exit();
  });
});

Budget.remove({}).then(function(){
  Budget.collection.insert(expenseSeeds).then(function(){
    process.exit();
  });
});
