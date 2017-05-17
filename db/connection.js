var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

if(process.env.NODE_ENV == "production"){
  mongoose.connect("mongodb://heroku_bqk8fvgm:51ukoeapk76n1hd7n8lq9hj2ar@ds153657.mlab.com:53657/heroku_bqk8fvgm");
}else{
  mongoose.connect("mongodb://localhost/docket");
}

var EventSchema = new mongoose.Schema(
  {
  category: String,
  name: String,
  duration: Number,
  reoccuring: String,
  first_day: Date,
  date: Number,
  month: Number
  }
);
mongoose.model("Events", EventSchema);

var ExpenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  type: String,
  recurring: String,
  category: String
});
mongoose.model("Expenses", ExpenseSchema);

var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

var Users = module.exports = mongoose.model("Users", UserSchema);

Users.createUser = function(newUser, callback){
  console.log("In connection file")
  console.log(newUser)
  console.log(callback)
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        console.log(newUser.password)
        Users.create(newUser).then(callback)
    });
  });
}

var TodoSchema = new mongoose.Schema({
  list_name: String,
  list_type: String,
  list_created_on: Date,
  start_time: String,
  end_time: String,
  duration: Number,
  first_day: Date,
  budget: Number,
  list_reocurring: String,
  list_recur_end: String,
  master_tasks: [],
  lists: [],
  listsInMonths: [],
  category: String,
  task_name: String,
  task_completed: Boolean,
  task_rank: Number,
  category: String,
  time_estimate: Number,
  time_actual: Number,
  reocurring: String,
  created_at: Date,
  completed_on: Date,
  deadline: Date
});

mongoose.model("Todo", TodoSchema);

module.exports = mongoose;
