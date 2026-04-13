import express from "express";
import {errorHandler} from '#middleware/errorHandlers';
import {studentRoutes} from '#modules/modules';
//import authRoutes from '#auth/auth.routes';
//node seimport { version } from "react";



const app = express();

app.get('/', (req, res) =>{
    res.json({
        message: 'Welcome to the Student API',
        version: '1.0.0',
        endpoints: {
            students: '/api/students',
            
        }
    })
})


app.use(express.json());

//app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.use(errorHandler);

export default app;


