const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 
const Task = require('./tasks');

class TaskDependency extends Model {
    // static methods
    static findByTaskId(taskId) {
        return this.findAll({ where: { taskId } });
    }

    static findByDependentTaskId(dependentTaskId) {
        return this.findAll({ where: { dependentTaskId } });
    }
    static async calculateTaskPriority(taskId) {
        const nbDependentTasks = await this.findByTaskId(taskId).length; // Number of tasks that the task depends on
        const nbDependentOnTasks = await this.findByDependentTaskId(taskId).length; // Number of tasks that depend on the task
        if(nbDependentTasks == 0 && nbDependentOnTasks == 0 || nbDependentTasks > 0 && nbDependentOnTasks == 0) {
            return 3;
        }
        else if(nbDependentTasks == 0 && nbDependentOnTasks > 0) {
            return 1;
        }
        else if(nbDependentTasks > 0 && nbDependentOnTasks > 0) {
            return 2;
        }
        else {
            return 3;
        }
    }
}

TaskDependency.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID v4
        primaryKey: true,
    },
    taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Task,
            key: 'id',
        },
    },
    dependentTaskId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Task,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'TaskDependency',
    timestamps: true,
    tableName: 'task_dependencies',
});

module.exports = TaskDependency;