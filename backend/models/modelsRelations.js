// the models
const User = require('./users');
const VerificationToken = require('./verificationTokens');

// define the relation between the models

 User.hasMany(VerificationToken, {
    foreignKey: 'userId',
    as: 'verificationTokens'
});

VerificationToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});


// User.hasMany(House, {
//     foreignKey: 'userId',
//     as: 'houses'
// });

// House.belongsTo(User, {
//     foreignKey: 'userId',
//     as: 'user'
// });