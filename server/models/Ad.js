const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  title: String,
  desc: String,
  link: String,
  date: Date
});

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;