import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Sequelize, DataTypes } from 'sequelize';
import LikesModel from './LikesModel.js';

const app = express();
app.use(cors({
    // ... cors configuration
}));
app.use(cookieParser());

// Load environment variables
dotenv.config();

// Set up Sequelize and define StoryModel
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    logging: false,//This will pause the regular Message on executing the frontend so that backend doesn't get too much busy 
    /* 
    Executing (default): SELECT `id`,
     `userId`, `title`, `description`,
      `file`, `postedby`, `createdAt`,
       `updatedAt` FROM `posts` 
        AS `posts`;
    This is the messege that is showing every render from the front end and it is too much annoying when you use the useEffect for the re-rendering
        */
});
const StoryModel = sequelize.define('StoryModel', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    story: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: false
    },
    userID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: false
    },
    file: {
        type: DataTypes.STRING,
        allowNull: true
    },
    likesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Initialize the count to zero
    },
})
sequelize.sync({ force: false }) // This will create the table if it doesn't exist and if exists then delete the old one and then create
    .then(() => {
        console.log('Story Tables synchronized');
    })
    .catch(error => {
        console.error('\nError synchronizing tables:', error, "\n\n");
    });

StoryModel.hasMany(LikesModel, { foreignKey: 'postId', as: 'likes' });

export default StoryModel