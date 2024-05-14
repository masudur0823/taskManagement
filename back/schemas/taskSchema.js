const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamp: true }
);

module.exports = taskSchema;
