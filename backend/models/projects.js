const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

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
    
}, {
    sequelize,
    modelName: 'Project',
    timestamps: true,
    tableName: 'projects',
});

module.exports = Project;