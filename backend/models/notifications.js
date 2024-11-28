const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

class Notification extends Model {
    // instance methods
    toJSON() {
        const values = {...this.get()};
        return values;
    }

    // static methods
    static findById(id) {
        return this.findByPk(id);
    }

    // find all notifications for a user
    static findAllByUserId(userId) {
        return this.findAll({ where: { userId } });
    }
}

Notification.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Project',
            key: 'id',
        },
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'User',
            key: 'id',
        },
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'Notification',
    timestamps: true,
    tableName: 'notifications',
})

module.exports = Notification;