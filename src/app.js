import express from "express";
import authRoutes from '#auth/authRoutes';
import {errorHandler} from '#middleware/errorHandlers';
import {
    
        studentRoutes ,
         teachersRoutes,
          subjectRoutes,
           classRoutes,
           attendanceRoutes,
           gradesRoutes,
             parentsRoutes,
                classSubjectsRoutes
        
    } from '#modules/modules';

import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

const app = express()

app.use(compression())


app.use(morgan('dev'))


app.use(helmet())

app.use(cors({
    origin: 'http://localhost:5173'  
    
}))


const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 35,
    message: { error: 'Too many requests, please try again later' }
})

const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,  // 1 minute
    max: 10,
    message: { error: 'Too many login attempts, please try again later' }
})

app.use(express.json())
app.use(generalLimiter)  // applies to all routes


app.use((req, res, next) => {
    next()
})

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
            grades: '/api/grades',
            parents: '/api/parents',
            classSubjects: '/api/class-subjects'
        }
    })
})




app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/parents', parentsRoutes);
app.use('/api/class-subjects', classSubjectsRoutes);
app.use(errorHandler);

export default app;


