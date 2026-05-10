import express from "express";
import authRoutes from '#auth/authRoutes';
import {errorHandler} from '#middleware/errorHandlers';
import {
    
        studentRoutes ,
         teacherRoutes,
          subjectRoutes,
           classRoutes,
           attendanceRoutes,
           gradesRoutes
        
    } from '#modules/modules';


//node seimport { version } from "react";



const app = express();
app.use(express.json());

app.get('/', (req, res) =>{
    res.json({
        message: 'Welcome to the Student API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            students: '/api/students',
            teachers: '/api/teachers',
            subjects: '/api/subjects',
            classes: '/api/classes',
            attendance: '/api/attendance',
            grades: '/api/grades'
        }
    })
})





app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradesRoutes);

app.use(errorHandler);

export default app;


