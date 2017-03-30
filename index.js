// ::start:: dependencies
var express  = require("express");
var mongoose = require("./db/connection.js");
var hbs      = require("express-handlebars");
var parser   = require("body-parser");
var app      = express();
//  ::end:: dependencies
var Events   = mongoose.model("Events");
var Expenses = mongoose.model("Expenses");
var Todo = mongoose.model("Todo");

app.use("/assets", express.static("public"));
app.set("port", process.env.PORT || 3002);

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

app.get('/api/todo', function(req, res){
  console.log("todo get ")
  Todo.find().then(function(todo){
    res.json(todo)
  });
});

app.get('/api/todo/:name', function(req, res){
  console.log("findOne todo List get")
  console.log(req.params.name)
  Todo.findOne({task_name: req.params.name}).then(function(todo){
    res.json(todo)
  })
})

app.post("/api/todo", function(req, res){
  console.log("api POST ")
  // console.log("api POST " + JSON.stringify(req.body))
  Todo.create(req.body).then(function(){
    res.redirect("/")
  })
})

app.put("/api/todo/", function(req, res){
  console.log("todo PUT ")
  // console.log(req.body)
  console.log(req.body.todo)
  console.log(req.body.todo.list_name)
  console.log(req.body.todo.master_tasks)
  console.log(req.body.todo.task_name)
  Todo.findOneAndUpdate({list_name: req.body.todo.list_name}, req.body.todo, {new: false}).then(function(todo){
    res.json(todo)
  })

// below didn't work for master tasks...
  // Todo.findOneAndUpdate({list_name: req.body.todo.list_name}, {$push: {master_tasks: req.body.todo.master_tasks}})
  // .then(function(todo){
  //   res.json(todo)
  // })

})

app.get('/expenses', function(req, res){
  console.log("expenses api called. 1")
  Expenses.find().then(function(expenses){
    res.json(expenses)
  });
});

app.post('/expenses', function(req, res){
  console.log("expenses post call = " + JSON.stringify(req.body))
  Expenses.create(req.body).then(function(){
    res.redirect("/")
  })
})

// all events endpoint
app.get('/api/event', function(req, res){
  console.log('app.get /api is being used')
  console.log(req.params)
  Events.find().then(function(events){
    res.json(events)

  });
});

app.get('/api/event/:name', function(req, res){
  console.log("findOne Event get")
  console.log(req.params.name)
  Events.findOne({name: req.params.name}).then(function(event){
    res.json(event)
  })
})

// creates event
app.post("/api/event", function(req, res){
  console.log("api POST " + JSON.stringify(req.body))
  Events.create(req.body).then(function(){
    res.redirect("/")
  })
})

app.put("/api/event/:name", function(req, res){
  console.log(req.params)
  Events.findOneAndUpdate({name: req.params.name}, req.body.event, {new: true}).then(function(event){
    res.json(event)
  })
})

app.delete("/api/event/:name",function(req, res){
  console.log(req.params.name)
  Events.findOneAndRemove({name: req.params.name}).then(function(){
    res.json({success: true})
  })
})

// route that directs to event.hbs, which is where we bootstrap angular
app.get("/*", function(req, res){
  console.log("wild card y'all")
  console.log(req.params.name)
  res.render("event")
})

// app.listen(3002, function(){
//   console.log("::::::::::::: You have turned me on.  I am alive... :::::::::::::")
// })

app.listen(app.get("port"), function(){
  console.log("I'm alive...");
});
