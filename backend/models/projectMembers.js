const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

class ProjectMembers extends Model {
    // instance methods
    toJSON() {
        const values = {...this.get()};
        return values;
    }

    // static methods
    static findById(id) {
        return this.findByPk(id);
    }

    // find by project id
    static findByProjectId(projectId) {
        return this.findAll({ where: { projectId } });
    }

    // find all by user id 
    static findAllByUserId(userId) {
        return this.findAll({ where: {userId} });
    }
}

ProjectMembers.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Project',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
        },
    },
    role: {
        type: DataTypes.ENUM('Owner', 'Project Manager', 'Developer', 'Tester/QA', 'Contributor', 'Observer'),
        allowNull: false,
        defaultValue: 'Contributor',
    },

    // Project Manager: Critical for overseeing the project's overall direction, especially in collaborative and deadline-driven environments.
    // Developer: A must-have if your project involves technical tasks like coding or implementing features.
    // Tester/QA Engineer: Necessary if your project outputs need verification (e.g., software projects). Otherwise, this role may not be as critical for simpler projects.
    // Contributor: Useful as a general role for team members actively working on assigned tasks.
    // Observer: Useful for training purposes or clients who want limited access. Not essential for core project execution.
}, {
    sequelize,
    modelName: 'ProjectMembers',
    timestamps: true,
    tableName: 'project_members',
})

module.exports = ProjectMembers;