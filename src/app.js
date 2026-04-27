import express from "express";
import {errorHandler} from '#middleware/errorHandlers';
import {studentRoutes ,
         teacherRoutes,
          subjectRoutes,
           classRoutes
        
    } from '#modules/modules';

//import authRoutes from '#auth/auth.routes';
//node seimport { version } from "react";



const app = express();
app.use(express.json());

app.get('/', (req, res) =>{
    res.json({
        message: 'Welcome to the Student API',
        version: '1.0.0',
        endpoints: {
            students: '/api/students',
            teachers: '/api/teachers',
            subjects: '/api/subjects',
            classes: '/api/classes'
            
        }
    })
})




//app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/classes', classRoutes);


app.use(errorHandler);

export default app;


