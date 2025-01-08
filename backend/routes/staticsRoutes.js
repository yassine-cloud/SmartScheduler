const Project = require('../models/projects');
const Task = require('../models/tasks');
const User = require('../models/users');
const Resource = require('../models/resources');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
   
    let totalProjects = 0;
    let totalTasks = 0;
    let totalUsers = 0;
    let totalResources = 0;
    let totalProjectCost = 0;
    let totalResourceCost = 0;
    try{
        // Get total number of projects
        totalProjects = await Project.count() ;

        // Get total number of tasks
        totalTasks = await Task.count();

        // Get total number of users
        totalUsers = await User.count();

        // Get total number of resources
        totalResources = await Resource.count();

        // Get total project cost
        const projects = await Project.findAll();
        projects.forEach(project => {
            totalProjectCost += Number(project.budget) || 0;
        });

        // Get total resource cost
        const resources = await Resource.findAll();
        resources.forEach(resource => {
            totalResourceCost += Number(resource.cost) || 0;
        });

        return res.status(200).json({
            totalProjects,
            totalTasks,
            totalUsers,
            totalResources,
            totalProjectCost,
            totalResourceCost,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

});

module.exports = router;