const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');
const ProjectMembers = require('./projectMembers');

class Project extends Model {
    // instance methods
    toJSON() {
        const values = {...this.get()};
        return values;
    }

    // static methods
    static findById(id) {
        return this.findByPk(id);
    }

    // Find all projects by user ID
    static async findAllByUserId(userId) {
        // Find all project memberships for the given user
        const memberships = await ProjectMembers.findAll({
            where: { userId },
            attributes: ['projectId'], // Only fetch the projectId column
        });

        // Extract the project IDs
        const projectIds = memberships.map((membership) => membership.projectId);

        // Return projects that match the extracted IDs
        return this.findAll({
            where: { id: projectIds },
        });
    }
}

Project.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    budget: {
        type: DataTypes.DECIMAL(15, 3),
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Completed', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Active',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

}, {
    sequelize,
    modelName: 'Project',
    timestamps: true,
    tableName: 'projects',
});

module.exports = Project;