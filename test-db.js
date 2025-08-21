
import Sequelize from 'sequelize';

const sequelize = new Sequelize('skillNest', 'admin', '*123456789', {
    host: 'skillnest.c34282iaep2j.eu-north-1.rds.amazonaws.com',
    dialect: 'mysql',
    port: 3306,
    logging: false,
});

module.exports = sequelize;
