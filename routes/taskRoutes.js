import express from 'express'

const router = express.Router()

import Task from '../models/Task.js'
import Project from '../models/Project.js'
import { authMiddleware } from '../utils/auth.js'

router.use(authMiddleware);

router.post('/:projectId/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (project.user != req.user._id) {
        return res.status(403).json({ message: 'User forbidden from updating this project' });
    }
    const task = new Task({
      ...req.body,
      project: req.params.projectId
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/projects/:projectId/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
       if (project.user != req.user._id) {
        return res.status(403).json({ message: 'User forbidden from accessing this project' });
    }
    const tasks = await Task.find(
        {project: { $eq: req.params.projectId}});
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    const projectField = task.project;
    const project = await Project.findById(projectField);
    if (req.user._id != project.user) {
        return res.status(403).json({ message: 'User forbidden from updating this task' });
    }
    if (!task) {
      return res.status(404).json({ message: 'No task found with this id!' });
    }
    const updateTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, {returnDocument: 'after'});
    res.json(updateTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/tasks/:taskId', async (req, res) => {
  try {
const task = await Task.findById(req.params.taskId);
    const projectField = task.project;
    const project = await Project.findById(projectField);
    if (!project) {
        return res.status(404).json({ message: 'No project affiliated with this task!' });
    }
    if (req.user._id != project.user) {
        return res.status(403).json({ message: 'User forbidden from deleting this task' });
    }
    if (!task) {
      return res.status(404).json({ message: 'No task found with this id!' });
    }
    const deleteTask = await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: `Task ID ${deleteTask._id} deleted!` });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router