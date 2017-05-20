// ::start:: dependencies
var express  = require("express");
var mongoose = require("./db/connection.js");
var hbs      = require("express-handlebars");
var parser   = require("body-parser");
var app      = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
//  ::end:: dependencies
var Events   = mongoose.model("Events");
var Expenses = mongoose.model("Expenses");
var Todo = mongoose.model("Todo");
var Users = mongoose.model("Users");

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

// Global varialbes
app.use(function(req, res, next){
  res.locals.user = req.user || null;
  next();
})

app.use(passport.initialize());

var verify = function(response){
  console.log(response)
}

console.log(passport.use(new LocalStrategy(verify)))

passport.use(new LocalStrategy(
  // {usernameField:'login',
  //   passwordField:'password'},
  function(username, password, done) {
    console.log(username)
    console.log(password)

    var candidatePassword = password;

    Users.getUserByUsername(username, function(err, user){
      if (err) throw err;
      if(!user){
        return done(null, false, {message: "Unknown username"})
      }
      Users.comparePassword(password, user.password, function(err, isMatch){
        console.log("Users.comparePassword isMatch: ")
        console.log(isMatch)
        if(err) throw err;
        if(isMatch){
          return done(null, user)
        } else {
          return done(null, false, {message: "Invalid password"})
        }
      })
    })

        // var findOneCallback = function(response){
        //   console.log("successFunction")
        //   console.log(response)
        //   var hash = response.password;
        //   console.log(candidatePassword)
        //   console.log(hash)
        //
        //   bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        //     console.log(err)
        //     console.log(isMatch)
        //     if(err) throw err;
        //     // callback(null, isMatch);
        //   });
        // };

    // Users.findOne({email: username}).then(findOneCallback)

  }, verify));

  passport.serializeUser(function(user, done) {
    console.log("serializeUser")
    console.log(user)
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("deserializeUser")
    console.log(id)
    Users.getuserById(id, function(err, user) {
      done(err, user);
    });
  });

var setUser = function(user){
  if(user){
    user = user
  } else {
    return user
  }
};

app.get('/userAuth', function(req, res, next){
  console.log(req.body)
  console.log(setuser())
  res.json(user)
})


app.post('/login', function(req, res, next) {
  console.log("in /login endpoint")
  console.log(req.body)
  // console.log(res)
  console.log(next)
  passport.authenticate('local', {successRedirect: "/", failureRedirect: "/login"},
  function(err, user, info) {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~ in passport ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log(err)
    console.log(user)
    setUser(user)
    console.log(info)
    if (err) { return res.json(user); }

    if (!user) { return res.json({status: "fail", message: info}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({status: "success"});
    });

    // res.redirect('/')


  })(req, res, next);
});

app.post('/register', function(req, res){
  console.log(req.body)

  Users.createUser(req.body, function(user, err){
    console.log("in Users.createUser.  users then error below")
    console.log(user)
    console.log(err)
    if(err){
      res.json(err)
    } else {
      res.json(user)
    }
  })
});

app.get('/api/todo/:name', function(req, res){
  console.log("findOne todo List get")
  console.log(req.params.name)
  Todo.findOne({task_name: req.params.name}).then(function(todo){
    res.json(todo)
  })
})

app.get('/api/todo', function(req, res){
  console.log("todo get ")
  console.log(req.query)
  // console.log(req)
  if(req.query.list_name){
    Todo.findOne({list_name: req.query.list_name}).then(function(todo){
      res.json(todo)
    })
  } else {
    Todo.find().then(function(todo){
      res.json(todo)
    });
  }
});


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

  res.render("event")
})

// app.listen(3002, function(){
//   console.log("::::::::::::: You have turned me on.  I am alive... :::::::::::::")
// })

app.listen(app.get("port"), function(){
  console.log("::::::::::::: You have turned me on.  I am alive... :::::::::::::");
});
