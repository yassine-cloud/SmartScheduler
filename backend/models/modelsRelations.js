// the models
const User = require('./users');
const VerificationToken = require('./verificationTokens');
const ResetPassword = require('./resetPassword');
const Project = require('./projects');
const Notification = require('./notifications');
const projectMembers = require('./projectMembers');

// define the relation between the models

// users
 User.hasMany(VerificationToken, {
    foreignKey: 'userId',
    as: 'verificationTokens'
});

User.hasMany(ResetPassword, {
    foreignKey: 'userId',
    as: 'resetPasswords'
});

User.hasMany(Notification, {
    foreignKey: 'userId',
    as: 'notifications'
});

User.hasMany(projectMembers, {
    foreignKey: 'userId',
    as: 'projectMembers'
});

//verification tokens
VerificationToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// reset password
ResetPassword.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});


// projects
Project.hasMany(Notification, {
    foreignKey: 'projectId',
    as: 'notifications',
    onDelete: 'CASCADE'
});

Project.hasMany(projectMembers, {
    foreignKey: 'projectId',
    as: 'projectMembers',
    onDelete: 'CASCADE'
});

// notifications
Notification.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Notification.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

// project members
projectMembers.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

projectMembers.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

