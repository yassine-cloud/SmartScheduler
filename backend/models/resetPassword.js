const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 
const User = require('./users');

class ResetPassword extends Model {
    // static methods
    static findByToken(token) {
        return this.findOne({ where: { token } });
    }

    static findByUserId(userId) {
        return this.findOne({ where: { userId } });
    }
}

ResetPassword.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID v4
        primaryKey: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'ResetPassword',
    timestamps: false,
    tableName: 'reset_passwords',
});

module.exports = ResetPassword;