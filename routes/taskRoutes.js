import express from 'express'

const router = express.Router()

import Task from '../models/Task.js'
import Project from '../models/Project.js'
import { authMiddleware } from '../utils/auth.js'

router.use(authMiddleware);

router.post('/:projectId/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    const user = req.user._id;
    if (project.user != user) {
        return res.status(403).json({ message: 'User forbidden from updating this project' });
    }
    const task = new Task({
      ...req.body,
      project: project
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router