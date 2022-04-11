const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('toughts', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
})

try{
    sequelize.authenticate();
    console.log('Banco de dados autenticado');
}catch(err){
    console.error(`Erro, não foi possivel conectar no banco de dados, mais: ${err}`);
}

module.exports = sequelize;