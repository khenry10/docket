var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/docket");

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
  category: String
});
mongoose.model("Expenses", ExpenseSchema);

module.exports = mongoose;
