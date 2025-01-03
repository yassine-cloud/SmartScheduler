const Task = require('../models/tasks');
const TaskDependency = require('../models/taskDependencies');
const TaskResource = require('../models/taskResources');
const sequelize = require('../config/sequelize');
const SubTask = require('../models/subTasks');


// Update task priority based on dependencies
async function updateTaskPriority(taskId) {
    const task = await Task.findByPk(taskId);
    if (!task) {
        throw new Error('Task not found');
    }

    const priority = await TaskDependency.calculateTaskPriority(taskId);
    const priorityConvert = { 1: 'low', 2: 'medium', 3: 'high' };

    if (!priorityConvert[priority]) {
        console.error('Invalid priority:', priority);
        return;
    }

    task.priority = priorityConvert[priority];
    await task.save();
}

// Add task dependencies and update affected task priorities
// consider adding the test to check if there is a cisrcular dependency or not 
async function addTaskDependency(taskId, dependentTasksId) {
    const transaction = await sequelize.transaction();
    let tasksGotAffected = [];

    try {
        if (dependentTasksId.length > 0) {
            const promises = dependentTasksId.map(async (element) => {
                tasksGotAffected.push(element);
                return TaskDependency.create(
                    {
                        taskId: taskId,
                        dependentTaskId: element,
                    },
                    { transaction }
                );
            });

            await Promise.all(promises);
        }

        await transaction.commit();

        // Update priorities of all affected tasks in parallel
        await Promise.all(tasksGotAffected.map(updateTaskPriority));
    } catch (error) {
        await transaction.rollback();
        console.error("Failed to add task dependencies:", error);
        throw error;
    }
}

// update task dependencies and update affected task priorities
async function updateTaskDependency(taskId, dependentTasksId) {
    const transaction = await sequelize.transaction();
    let tasksGotAffected = await TaskDependency.findByTaskId(taskId);
    let taskTogetUpdated = [];

    try {

        if (dependentTasksId.length > 0) {
            let promises = dependentTasksId.map(async (element) => {
                if ( tasksGotAffected.find((e) => {return e.dependentTaskId == element}) == -1 ) {
                    taskTogetUpdated.push(element);                
                    return TaskDependency.create(
                        {
                            taskId: taskId,
                            dependentTaskId: element,
                        },
                        { transaction }
                    );
                }
                else tasksGotAffected = tasksGotAffected.filter(e => e.dependentTaskId != element);
            });

            promises = promises.concat(tasksGotAffected.map(async (element) => {
                taskTogetUpdated.push(element.dependentTaskId);
                return TaskDependency.destroy(
                    {
                        where: {
                            taskId: taskId,
                            dependentTaskId: element.dependentTaskId,
                        },
                    },
                    { transaction }
                );
            }));

            await Promise.all(promises);
        }

        await transaction.commit();

        // Update priorities of all affected tasks in parallel
        await Promise.all(taskTogetUpdated.map(updateTaskPriority));
    } catch (error) {
        await transaction.rollback();
        console.error("Failed to update task dependencies:", error);
        throw error;
    }
}

// delete task dependencies and update affected task priorities
async function deleteTaskDependency(taskId) {

    const transaction = await sequelize.transaction();
    let tasksGotAffected = await TaskDependency.findByTaskId(taskId);
    tasksGotAffected.push(TaskDependency.findByDependentTaskId(taskId));

    try {
        // Delete all existing dependencies
        await TaskDependency.destroy({ where: { taskId: taskId } }, { transaction });
        await TaskDependency.destroy({ where: { dependentTaskId: taskId } }, { transaction });
        await transaction.commit();

        // Update priorities of all affected tasks in parallel
        await Promise.all(tasksGotAffected.map(e => updateTaskPriority(e.id)));
    } catch (error) {
        await transaction.rollback();
        console.error("Failed to delete task dependencies:", error);
        throw error;
    }
}

module.exports = {

    async createTask(req, res) {
        try {
            const { dependentTasksId } = req.body;
            const task = await Task.create(req.body);
            if (dependentTasksId.length > 0) {
                await addTaskDependency(task.id, dependentTasksId);
            }
            return res.status(201).json(task);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getTasks(req, res) {
        try {
            const projectId = req.query.projectId;
            const userId = req.query.userId;
            if (projectId && userId) {
                let tasks = await Task.findAll({ where: { projectId: projectId, userId: userId } });
                tasks = tasks.map(task => {
                    task.dependentTasksId = TaskDependency.findByTaskId(task.id).then((dependentTasks) => dependentTasks.map(e => e.dependentTaskId));
                    task.resourcesId = TaskResource.findByTaskId(task.id).then((resources) => resources.map(e => e.resourceId));
                    task.nbSubtasks = SubTask.countByTaskId(task.id);
                    return task;
                });
                return res.status(200).json(tasks);
            }
            else if (projectId) {
                let tasks = await Task.findByProjectId(projectId);
                tasks = tasks.map(task => {
                    task.dependentTasksId = TaskDependency.findByTaskId(task.id).then((dependentTasks) => dependentTasks.map(e => e.dependentTaskId));
                    task.resourcesId = TaskResource.findByTaskId(task.id).then((resources) => resources.map(e => e.resourceId));
                    task.nbSubtasks = SubTask.countByTaskId(task.id);
                    return task;
                });
                return res.status(200).json(tasks);
            }
            else if (userId) {
                let tasks = await Task.findByUserId(userId);
                tasks = tasks.map(task => {
                    task.dependentTasksId = TaskDependency.findByTaskId(task.id).then((dependentTasks) => dependentTasks.map(e => e.dependentTaskId));
                    task.resourcesId = TaskResource.findByTaskId(task.id).then((resources) => resources.map(e => e.resourceId));
                    task.nbSubtasks = SubTask.countByTaskId(task.id);
                    return task;
                });
                return res.status(200).json(tasks);
            }
            else {
                return res.status(400).json({ error: 'Project Id is required to get tasks' });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getTask(req, res) {
        try {
            const { id } = req.params;
            const task = await Task.findByPk(id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            task.dependentTasksId = TaskDependency.findByTaskId(task.id).then((dependentTasks) => dependentTasks.map(e => e.dependentTaskId));
            task.resourcesId = TaskResource.findByTaskId(task.id).then((resources) => resources.map(e => e.resourceId));
            task.nbSubtasks = SubTask.countByTaskId(task.id);
            return res.status(200).json(task);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const { dependentTasksId } = req.body;
            const [updated] = await Task.update(req.body, {
                where: { id: id }
            });
            if (updated) {
                const updatedTask = await Task.findByPk(id);
                await updateTaskDependency(id, dependentTasksId);
                return res.status(200).json(updatedTask);
            }
            throw new Error('Task not found');
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Task.destroy({
                where: { id: id }
            });
            if (deleted) {
                deleteTaskDependency(id);
                return res.status(204).send("Task deleted");
            }
            throw new Error("Task not found");
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async createTaskDependency(req, res) {
        try {
            const taskDependency = await TaskDependency.create(req.body);
            return res.status(201).json(taskDependency);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    async getTaskDependencies(req, res) {
        try {
            const taskDependencies = await TaskDependency.findAll();
            return res.status(200).json(taskDependencies);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

}