var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/docket");

var EventSchema = new mongoose.Schema(
  {
  category: String,
  name: String,
  duration: Number,
  reoccuring: String,
  start_time: Date
  }
);

mongoose.model("Events", EventSchema);

module.exports = mongoose;
