import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

export const Course = sequelize.define(
    'Course',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.INTEGER,
        },
        instructorId: {
            type: DataTypes.INTEGER,
        },
    },
);