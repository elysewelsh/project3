import express from 'express'

const router = express.Router()

import Project from '../models/Project.js'
import Task from '../models/Task.js'
import { authMiddleware } from '../utils/auth.js'
 
// Apply authMiddleware to all routes in this file
router.use(authMiddleware);
 
// GET /api/projects - Get all projects for the logged-in user
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find(
        {user: { $eq: req.user._id}});
    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const projects = await Project.find(
        {user: { $eq: req.user._id},
        _id: {$eq: req.params.id}}
    );
    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// POST /api/projects - Create a new project
router.post('/', async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      user: req.user._id
    });
    console.log("inside the project:" + project)
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json(err);
  }
});
 
// PUT /api/projects/:id - Update a project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (req.user._id != project.user) {
        return res.status(403).json({ message: 'User forbidden from updating this project' });
    }
    if (!project) {
      return res.status(404).json({ message: 'No project found with this id!' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});
 
// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req, res) => {
  try {
    const parentProject = await Project.findById(req.params.id);
    if (!parentProject) {
      return res.status(404).json({ message: 'No project found with this id!' });
    }
    if (req.user._id != parentProject.user) {
        return res.status(403).json({ message: 'User forbidden from deleting this project' });
    }
    // const tasks = await Task.find({
    //     project: {$eq: req.params.id}
    // })
    // console.log(tasks);
    const deleteProject = await Project.findByIdAndDelete(req.params.id);
    const deleteTasks = await Task.deleteMany({ project: { $eq: req.params.id}});
    res.json({ message: `Project ID ${deleteProject._id} deleted! ${deleteTasks.deletedCount} task(s) deleted as well` });
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
});
 
export default router