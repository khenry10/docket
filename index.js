// ::start:: dependencies
var express  = require("express");
var mongoose = require("./db/connection.js");
var hbs      = require("express-handlebars");
var parser   = require("body-parser");
var app      = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
//  ::end:: dependencies
var Events   = mongoose.model("Events");
var Budget = mongoose.model("Budget");
var Todo = mongoose.model("Todo");
var Users = mongoose.model("Users");
var Employment = mongoose.model("Employment");

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
  console.log(req.user)
  res.locals.user = req.user || null;
  next();
})

app.use(session({
  secret: 'secret',
  rolling: true,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  // saveUnitialized: true,
  resave: true,
}));

console.log("**** session start *****")
console.log(session)
console.log("**** session end *****")

app.use(passport.initialize());
app.use(passport.session());

var verify = function(response){
  console.log("verify function.  response is below")
  console.log(response)
}

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
        if(err) throw err;
        if(isMatch){
          return done(null, user)
        } else {
          return done(null, false, {message: "Invalid password"})
        }
      })
    })
  }, verify));

  passport.serializeUser(function(user, done) {
    console.log("serializeUser")
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log("deserializeUser")
    Users.getUserById(id, function(err, user) {
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

app.post('/login', function(req, res, next) {
  console.log("in /login endpoint")
  passport.authenticate('local', {successRedirect: "/", failureRedirect: "/login"},
  function(err, user, info) {
    if (err) { return res.json(user); }
    if (!user) { return res.json({status: "fail", message: info}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({status: "success"});
    });
  })(req, res, next);
});

app.get('/logout', function(req, res){
  console.log("/logout ")
  req.logout();
  res.json({status: "success", message: "Logged out"});
});

app.post('/register', function(req, res){
  console.log(req.body)

  Users.createUser(req.body, function(user, err){
    console.log("in Users.createUser.  users then error below")
    if(err){
      res.json(err)
    } else {
      res.json({status: "success"})
    }
  })
});

app.get('/api/todo/:name', function(req, res){
  console.log("findOne todo List get")
  Todo.findOne({task_name: req.params.name}).then(function(todo){
    res.json(todo)
  })
})

app.get('/api/todo', function(req, res){
  console.log("todo get ")
  console.log("~~~~~ req.isAuthenticated() is below ~~~~~")
  console.log(req.isAuthenticated())
  if(req.user && req.user.id){
    if(req.query.list_name){
      Todo.findOne({list_name: req.query.list_name}).then(function(todo){
        res.json(todo)
      })
    } else {
      Todo.find({user_id: req.user.id}).then(function(todo){
        res.json(todo)
      });
    }
  } else {
    res.json([])
  }

});


app.post("/api/todo", function(req, res){
  console.log("api POST ")
  req.body.user_id = req.user.id
  Todo.create(req.body).then(function(){
    res.redirect("/")
  })
})

app.put("/api/todo/", function(req, res){
  console.log("todo PUT ")
  console.log(req.params.name)
  console.log(req.body.todo.list_name)
  console.log(req.body.todo._id)
  console.log(req.body.todo)

  Todo.findOneAndUpdate({_id: req.body.todo._id}, req.body.todo, {new: false}).then(function(todo, err){
    res.json(todo)
  })
})

app.delete("/api/todo/:name",function(req, res){
  console.log("DELETEEEEEEEEEE 2")
  // console.log(req)
  console.log(req.params.name)
  console.log(req.body)
  var error = function(message){
    console.log("error message")
    console.log(message)
  }
  Todo.findOneAndRemove({list_name: req.params.name}).then(function(response, error){
    console.log("success message")
    console.log(response)
    res.json({success: true})
  })
})

app.get('/api/budget', function(req, res){
  console.log("Budget GET api called. 1")
  Budget.find().then(function(budget){
    console.log("budget")
    console.log(budget)
    res.json(budget)
  }, function(error){
    console.log("error")
    console.log(error)
  });
});

app.post('/api/budget', function(req, res){
  console.log("Budget post call = " + JSON.stringify(req.body))


  Budget.create(req.body).then(function(){
    res.json({ status: 'success', itemAdded: req.body })
  })
})

app.get('/api/employment', function(req, res){
  console.log("employment GET")
  Employment.find().then(function(employment){
    res.json(employment)
  })
});

app.post('/api/employment', function(req, res){
  console.log("employment POST")
  Employment.create(req.body).then(function(position){
    res.json({ status: 'success', positionAdded: position })
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
