import express from 'express';
const app = express();
import dotenv from 'dotenv'
import sequelize from './database/connection.js';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/authRoutes.js'
import instructorRouter from './routes/instructorRoutes.js';
import studentRouter from './routes/studentRoutes.js';
import { setupAssociations } from './models/Index.js';

dotenv.config();

//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use('/api/auth', router)
app.use('/api/student', studentRouter)
app.use('/api/instructor', instructorRouter)

try {
    await sequelize.authenticate();
    console.log('database connected');
} catch (err) {
    console.log('database not connected');
}

setupAssociations();

await sequelize.sync(
    // { alter: true }  // to change tables
    // { force: true }
);

const port = process.env.PORT || 3001;
app.listen(port, console.log(`listening on port: ${port}`));
