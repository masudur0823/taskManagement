const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const taskSchema = require("../schemas/taskSchema");
const Task = new mongoose.model("Task", taskSchema);

// GET ALL TASK
router.get("/", async (req, res) => {
  // console.log(req.query)
  await Task.find()
    .limit(req?.query?.limit ? req?.query?.limit : 0)
    .then((data) =>
      res.status(200).json({
        message: "Todos was find successfully",
        totalData: data?.length,
        result: data,
      })
    )
    .catch(() =>
      res.status(500).json({
        error: "There was a server side error",
      })
    );
});

// GET A TASK BY ID
router.get("/:id", async (req, res) => {
  await Task.findOne({ _id: req.params.id })
    .then((data) =>
      res.status(200).json({
        message: "Todo was find successfully",
        totalData: data?.length,
        result: data,
      })
    )
    .catch(() =>
      res.status(500).json({
        error: "There was a server side error",
      })
    );
});

// POST A TASK
router.post("/", async (req, res) => {
  const newTask = await new Task(req.body);
  try {
    await newTask.save();
    res.status(200).json({
      message: "Task was inserted successfully",
    });
  } catch (error) {
    console.log("Task post error: ", error);
    res.status(500).json({
      message: "There was a server Side error",
      error: error,
    });
  }
});

// POST MULTITPLE TASK
router.post("/all", async (req, res) => {
  try {
    await Task.insertMany(req.body);
    res.status(200).json({
      message: "Task was inserted successfully",
    });
  } catch (error) {
    console.log("Task post error: ", error);
    res.status(500).json({
      message: "There was a server Side error",
      error: error,
    });
  }
});

// UPDATE A TASK BY ID
router.put("/:id", async (req, res) => {
  console.log(req.body);
  try {
    await Task.updateOne(
      { _id: req.params.id },
      {
        // $set: {
        //   // status: "active",
        //   // title:""
        // },
        $set: req.body,
      }
    );
    res.status(200).json({
      message: "Task was updated successfully",
    });
  } catch (error) {
    console.log("Task post error: ", error);
    res.status(500).json({
      message: "There was a server Side error",
      error: error,
    });
  }
});

// DELETE A TASK BY ID

router.delete("/:id", async (req, res) => {
  await Task.deleteOne({ _id: req.params.id })
    .then((data) =>
      res.status(200).json({
        message: "Todo was Delete successfully",
        totalData: data?.length,
        result: data,
      })
    )
    .catch(() =>
      res.status(500).json({
        error: "There was a server side error",
      })
    );
});

// DELETE Multiple Task BY
router.delete("/all", async (req, res) => {});

module.exports = router;
