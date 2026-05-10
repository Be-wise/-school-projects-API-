
import express from "express";
import * as studentController from "#modules/students/studentsControllers";
import {authenticate} from '#middleware/authenticate';
import {authorize} from '#middleware/authorize';

const router = express.Router(); 

router.post('/',authenticate, authorize('admin'), studentController.createStudents);
router.post('/bulk',authenticate,authorize('admin'), studentController.bulkCreateStudents);
router.get('/',authenticate, authorize('admin', 'teacher'), studentController.getAllStudents);
router.get('/:id',authenticate, authorize('admin', 'teacher', 'student', 'parent'), studentController.getStudentById);
router.patch('/:id',authenticate, authorize('admin'), studentController.updateStudent);
router.delete('/:id', authenticate, authorize('admin'), studentController.deleteStudent);

export default router;  

