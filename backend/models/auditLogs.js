const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 

class AuditLog extends Model {
    // instance methods
    toJSON() {
        const values = { ...this.get() };
        return values;
    }

    // static methods
    static findByUserId(userId) {
        return this.findAll({ where: { userId } });
    }

    
}

AuditLog.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID v4
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // description: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // }

}, {
    sequelize,
    modelName: 'auditLog',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false
});