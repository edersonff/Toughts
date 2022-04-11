const {DataTypes} = require('Sequelize');
const db = require('../db/conn')

const User = db.define('User',{
    name:{
        type: DataTypes.STRING,
        require: false,
    },
    email:{
        type: DataTypes.STRING,
        require: true,
    },
    password:{
        type: DataTypes.STRING,
        require: true
    }
})


module.exports = User;