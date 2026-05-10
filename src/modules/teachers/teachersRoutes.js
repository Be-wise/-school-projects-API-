import express from 'express' ;
import * as teacherController from '#modules/teachers/teacherControllers';
import { authenticate} from '#middleware/authenticate';
import {authorize} from '#middleware/authorize';

const router = express.Router();


router.post('/', authenticate, authorize('admin'), teacherController.createTeacher);
router.post('/bulk',authenticate, authorize('admin'), teacherController.bulkCreateTeachers);
router.get('/', authenticate, authorize('admin','teacher'), teacherController.getAllTeachers);
router.get('/:id', authenticate, authorize('admin', 'teacher'), teacherController.getTeacherById);
router.patch('/:id', authenticate, authorize('admin'), teacherController.updateTeacher);
router.delete('/:id', authenticate, authorize('admin'), teacherController.deleteTeacher);
router.post('/:id/subjects', authenticate, authorize('admin'), teacherController.assignTeacherToSubject);
router.post('/:id/classes', authenticate, authorize('admin'), teacherController.assignTeacherToClass);
router.get('/:id/subjects', authenticate, authorize('admin'), teacherController.getSubjectsByTeacherId);
router.get('/:id/classes', authenticate, authorize('admin'), teacherController.getClassesByTeacherId);
router.delete('/:id/subjects/:subjectId', authenticate, authorize('admin'), teacherController.removeTeacherFromSubjectById);
router.delete('/:id/classes/:classId', authenticate, authorize('admin'), teacherController.removeTeacherFromClassById);




export default router;