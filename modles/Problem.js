const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  maxLimit: Number,
  assignedTeams: { type: [mongoose.Schema.Types.ObjectId], ref: "Genisis", default: [] }
});

const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;
