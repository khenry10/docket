var mongoose = require("mongoose");

if(process.env.NODE_ENV == "production"){
  mongoose.connect(process.env.MONGOLAB_URI);
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

module.exports = mongoose;
