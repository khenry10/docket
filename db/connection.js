var mongoose = require("mongoose");

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

var TodoSchema = new mongoose.Schema({
  list_name: String,
  list_created_on: Date,
  start_time: String,
  end_time: String,
  duration: Number,
  first_day: Date,
  list_reocurring: String,
  list_recur_end: String,
  master_tasks: [],
  lists: [],
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

// test code beginning

// {
//   list_name: String,
//   list_created_on: Date,
//   list_recurring_interval: String,
//   list_recur_end: String,
//   category: String,
//   master_tasks: [{
//     name: String,
//     created_on: Date
//   }],
//   lists: [{
//     date: Date,
//     tasks: {
//       name: String,
//       completed: Boolean,
//       rank: Number,
//       time_estimate: Number,
//       time_actual: Number,
//       created_on: Date,
//       completed_on: Date,
//       deadline: Date
//     }
//   }]
// }

// test code end

mongoose.model("Todo", TodoSchema);

module.exports = mongoose;
