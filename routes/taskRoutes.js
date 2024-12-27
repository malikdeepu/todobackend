const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Fetch all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new task
router.post('/', async (req, res) => {
  const { title, description, status } = req.body;

  const task = new Task({ title, description, status });
  try {
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { title, description, status }, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    res.json(deletedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
