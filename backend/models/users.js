const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 
const { hashPassword } = require('../utils/crypt');

class User extends Model {
  // instance methods
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.passwordHash;
    return values;
  }

  // static methods
  static findByEmail(email) {
    return this.findOne({ where: { email } });
  }

  static findById(id){
    return this.findByPk(id);
  }
}

User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID v4
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        }
    },
    contact:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            // Hash the password before storing it in the database
            this.setDataValue('passwordHash', hashPassword(value));
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
    },
    image: {
        // it will be a relative path to the image
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
  sequelize, // Passing the `sequelize` instance is required
  modelName: 'User', // Name of the model
  timestamps: true, // Adds createdAt and updatedAt timestamps
  tableName: 'users', // Optional: Specifies the table name explicitly
});


module.exports = User;
