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
  start_time: Date,
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
  name: String,
  completed: Boolean,
  rank: Number,
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
